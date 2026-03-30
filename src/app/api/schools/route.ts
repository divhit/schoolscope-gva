import { NextRequest } from "next/server";
import { interpretSearch, analyzeSchool } from "@/lib/gemini";
import { enrichSchoolWithNearby, getSchoolPhoto } from "@/lib/places";
import { getAllSchools, getSchoolsNear } from "@/lib/schools-data";
import type { School, SearchRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function sse(type: string, data: unknown): string {
  return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  const body: SearchRequest = await request.json();
  const { query, latitude, longitude, radius } = body;

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (type: string, data: unknown) =>
        controller.enqueue(enc.encode(sse(type, data)));

      try {
        // Phase 1: Interpret query with Gemini
        const interpretation = await interpretSearch(query);
        send("interpreting", interpretation);

        // Phase 2: Find matching schools
        const allSchools = getAllSchools();
        let matches: School[];

        if (latitude && longitude) {
          const radiusKm = (radius ?? 15000) / 1000;
          matches = getSchoolsNear(latitude, longitude, radiusKm);
        } else {
          matches = allSchools;
        }

        // Filter by interpreted criteria
        const lowerTerms = interpretation.searchTerms.map((t) => t.toLowerCase());
        const lowerTypes = interpretation.schoolTypes.map((t) => t.toLowerCase());
        const lowerHoods = interpretation.neighborhoods.map((n) => n.toLowerCase());

        const scored = matches.map((school) => {
          let score = 0;

          // Name/tag matching
          for (const term of lowerTerms) {
            if (school.name.toLowerCase().includes(term)) score += 10;
            if (school.tags?.some((t) => t.toLowerCase().includes(term))) score += 5;
            if (school.address.toLowerCase().includes(term)) score += 3;
          }

          // Type matching
          if (lowerTypes.includes(school.category.toLowerCase())) score += 15;

          // Neighborhood matching
          for (const hood of lowerHoods) {
            if (school.district.toLowerCase().includes(hood)) score += 10;
            if (school.address.toLowerCase().includes(hood)) score += 8;
            if (school.tags?.some((t) => t.toLowerCase().includes(hood))) score += 5;
          }

          // Priority matching
          const lowerPriorities = interpretation.priorities.map((p) => p.toLowerCase());
          for (const priority of lowerPriorities) {
            if (priority.includes("academic") && (school.fsaOverall ?? 0) > 80) score += 10;
            if (priority.includes("small") && (school.classSize ?? 30) < 22) score += 8;
            if (priority.includes("french") && school.category === "French Immersion") score += 15;
            if (priority.includes("ib") && school.tags?.some((t) => t.includes("IB"))) score += 15;
            if (priority.includes("private") && school.category === "Independent") score += 12;
            if (priority.includes("arts") && school.tags?.some((t) => t.includes("arts"))) score += 12;
            if (priority.includes("rating") && (school.rating ?? 0) > 8) score += 10;
          }

          // Base quality score
          score += (school.fsaOverall ?? 50) / 10;
          score += (school.rating ?? 5);

          return { school, score };
        });

        scored.sort((a, b) => b.score - a.score);
        const topSchools = scored.slice(0, 12).map((s) => s.school);

        send("searching", topSchools);

        // Phase 3: Deep analysis with Gemini + Places API
        const BATCH = 3;
        for (let i = 0; i < Math.min(topSchools.length, 9); i += BATCH) {
          const batch = topSchools.slice(i, i + BATCH);
          await Promise.all(
            batch.map(async (school) => {
              try {
                const [nearbyInfo, photoUri] = await Promise.all([
                  enrichSchoolWithNearby(
                    school.location.latitude,
                    school.location.longitude
                  ),
                  getSchoolPhoto(
                    school.name,
                    school.location.latitude,
                    school.location.longitude
                  ),
                ]);

                const analysis = await analyzeSchool(school, query, nearbyInfo);

                send("analyzing", {
                  schoolId: school.id,
                  analysis,
                  photoUri,
                  nearbyInfo,
                });
              } catch (err) {
                console.error(`Analysis failed for ${school.name}:`, err);
              }
            })
          );
        }

        send("complete", { totalSchools: topSchools.length });
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "Something went wrong",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET() {
  const schools = getAllSchools();
  return Response.json(schools);
}
