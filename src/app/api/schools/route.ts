import { NextRequest } from "next/server";
import { interpretSearch, analyzeSchool } from "@/lib/gemini";
import { getSchoolPhoto } from "@/lib/places";
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
        let interpretation;
        try {
          interpretation = await interpretSearch(query);
          send("interpreting", interpretation);
        } catch (aiErr) {
          console.error("Gemini interpretation failed:", aiErr);
          // Fallback: use the raw query for searching
          interpretation = {
            searchTerms: query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2),
            schoolTypes: [] as string[],
            priorities: [] as string[],
            neighborhoods: [] as string[],
            summary: query,
            accentColor: "#6366f1",
          };
          send("interpreting", interpretation);
        }

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

        // Vancouver neighborhood → approximate lat/lng centers for geographic matching
        const NEIGHBORHOOD_CENTERS: Record<string, { lat: number; lng: number; radiusKm: number }> = {
          kitsilano: { lat: 49.2685, lng: -123.1680, radiusKm: 2 },
          "kits": { lat: 49.2685, lng: -123.1680, radiusKm: 2 },
          kerrisdale: { lat: 49.2330, lng: -123.1570, radiusKm: 1.5 },
          dunbar: { lat: 49.2500, lng: -123.1880, radiusKm: 2 },
          "point grey": { lat: 49.2650, lng: -123.2050, radiusKm: 2 },
          "west point grey": { lat: 49.2650, lng: -123.2050, radiusKm: 2 },
          fairview: { lat: 49.2630, lng: -123.1300, radiusKm: 1.5 },
          "mount pleasant": { lat: 49.2620, lng: -123.1000, radiusKm: 1.5 },
          "commercial drive": { lat: 49.2700, lng: -123.0700, radiusKm: 1.5 },
          "east van": { lat: 49.2610, lng: -123.0650, radiusKm: 3 },
          "east vancouver": { lat: 49.2610, lng: -123.0650, radiusKm: 3 },
          strathcona: { lat: 49.2780, lng: -123.0880, radiusKm: 1 },
          hastings: { lat: 49.2810, lng: -123.0540, radiusKm: 2 },
          "downtown": { lat: 49.2827, lng: -123.1207, radiusKm: 2 },
          "west end": { lat: 49.2850, lng: -123.1350, radiusKm: 1.5 },
          shaughnessy: { lat: 49.2440, lng: -123.1510, radiusKm: 1.5 },
          oakridge: { lat: 49.2260, lng: -123.1160, radiusKm: 2 },
          marpole: { lat: 49.2110, lng: -123.1290, radiusKm: 2 },
          sunset: { lat: 49.2230, lng: -123.0960, radiusKm: 2 },
          "south cambie": { lat: 49.2410, lng: -123.1150, radiusKm: 1.5 },
          riley: { lat: 49.2350, lng: -123.0730, radiusKm: 2 },
          killarney: { lat: 49.2200, lng: -123.0430, radiusKm: 2 },
          "south vancouver": { lat: 49.2150, lng: -123.1000, radiusKm: 3 },
          ubc: { lat: 49.2606, lng: -123.2460, radiusKm: 2 },
          "west vancouver": { lat: 49.3400, lng: -123.1700, radiusKm: 5 },
          "north vancouver": { lat: 49.3200, lng: -123.0700, radiusKm: 5 },
          vancouver: { lat: 49.2500, lng: -123.1200, radiusKm: 8 },
          "north shore": { lat: 49.3300, lng: -123.1200, radiusKm: 8 },
          burnaby: { lat: 49.2488, lng: -123.0016, radiusKm: 6 },
          richmond: { lat: 49.1666, lng: -123.1336, radiusKm: 6 },
          surrey: { lat: 49.1044, lng: -122.8251, radiusKm: 10 },
          "south surrey": { lat: 49.0500, lng: -122.8000, radiusKm: 5 },
          "white rock": { lat: 49.0252, lng: -122.8028, radiusKm: 3 },
          coquitlam: { lat: 49.2838, lng: -122.7932, radiusKm: 5 },
          "port moody": { lat: 49.2849, lng: -122.8573, radiusKm: 3 },
          "port coquitlam": { lat: 49.2627, lng: -122.7810, radiusKm: 3 },
          "new westminster": { lat: 49.2069, lng: -122.9110, radiusKm: 3 },
          delta: { lat: 49.0847, lng: -123.0587, radiusKm: 5 },
          tsawwassen: { lat: 49.0028, lng: -123.0822, radiusKm: 3 },
          langley: { lat: 49.1044, lng: -122.6600, radiusKm: 6 },
          "maple ridge": { lat: 49.2193, lng: -122.5984, radiusKm: 5 },
        };

        function distKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLng = ((lng2 - lng1) * Math.PI) / 180;
          const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }

        const scored = matches.map((school) => {
          let score = 0;
          let neighborhoodMatch = false;

          // Geographic neighborhood matching (HIGHEST PRIORITY)
          for (const hood of lowerHoods) {
            const center = NEIGHBORHOOD_CENTERS[hood];
            if (center) {
              const dist = distKm(school.location.latitude, school.location.longitude, center.lat, center.lng);
              if (dist <= center.radiusKm) {
                score += 50; // Strong match — school is IN the neighborhood
                neighborhoodMatch = true;
              } else if (dist <= center.radiusKm * 2) {
                score += 25; // Nearby
                neighborhoodMatch = true;
              } else if (dist <= center.radiusKm * 3) {
                score += 5; // Somewhat close
              }
              // Schools far from requested neighborhood get NO neighborhood bonus
            } else {
              // Fallback: text matching for unknown neighborhoods
              // Use exact district match to avoid "Vancouver" matching "West Vancouver"
              if (school.district.toLowerCase() === hood) { score += 30; neighborhoodMatch = true; }
              else if (school.district.toLowerCase().includes(hood) && !school.district.toLowerCase().startsWith("west") && !school.district.toLowerCase().startsWith("north")) { score += 25; neighborhoodMatch = true; }
              if (school.address.toLowerCase().includes(hood)) { score += 20; neighborhoodMatch = true; }
              if (school.tags?.some((t) => t.toLowerCase() === hood)) { score += 15; neighborhoodMatch = true; }
            }
          }

          // Name/tag matching
          for (const term of lowerTerms) {
            if (school.name.toLowerCase().includes(term)) score += 10;
            if (school.tags?.some((t) => t.toLowerCase().includes(term))) score += 5;
            if (school.address.toLowerCase().includes(term)) score += 3;
          }

          // Type matching
          if (lowerTypes.includes(school.category.toLowerCase())) score += 15;

          // Priority matching
          const lowerPriorities = interpretation.priorities.map((p) => p.toLowerCase());
          for (const priority of lowerPriorities) {
            if (priority.includes("academic") && (school.fsaOverall ?? 0) > 80) score += 8;
            if (priority.includes("small") && (school.classSize ?? 30) < 22) score += 6;
            if (priority.includes("french") && (school.programs?.some((p) => p.name.toLowerCase().includes("french")))) score += 20;
            if (priority.includes("immersion") && (school.programs?.some((p) => p.name.toLowerCase().includes("immersion")))) score += 20;
            if (priority.includes("ib") && school.programs?.some((p) => p.name.toLowerCase().includes("ib"))) score += 15;
            if (priority.includes("private") && school.category === "Independent") score += 12;
            if (priority.includes("independent") && school.category === "Independent") score += 12;
            if (priority.includes("arts") && school.tags?.some((t) => t.includes("arts"))) score += 10;
          }

          // Base quality score (smaller weight so geography dominates)
          score += (school.fsaOverall ?? 40) / 20;

          // If neighborhoods were specified and this school doesn't match, penalize
          if (lowerHoods.length > 0 && !neighborhoodMatch) {
            score -= 20;
          }

          return { school, score };
        });

        scored.sort((a, b) => b.score - a.score);
        const topSchools = scored.slice(0, 12).map((s) => s.school);

        send("searching", topSchools);

        // Phase 3: AI analysis (top 3 only, no Places API to stay under 60s)
        const toAnalyze = topSchools.slice(0, 3);
        await Promise.all(
          toAnalyze.map(async (school) => {
            try {
              const nearbyInfo = `District: ${school.district}, Category: ${school.category}, Enrollment: ${school.enrollment}`;
              const analysis = await analyzeSchool(school, query, nearbyInfo);

              // Try to get photo but don't block on it
              let photoUri: string | null = null;
              try {
                photoUri = await getSchoolPhoto(
                  school.name,
                  school.location.latitude,
                  school.location.longitude
                );
              } catch { /* skip photo */ }

              send("analyzing", {
                schoolId: school.id,
                analysis,
                photoUri,
              });
            } catch (err) {
              console.error(`Analysis failed for ${school.name}:`, err);
            }
          })
        );

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
