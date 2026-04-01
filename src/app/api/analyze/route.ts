import { NextRequest } from "next/server";
import { analyzeSchool } from "@/lib/gemini";
import { getSchoolPhoto } from "@/lib/places";
import { getSchoolById } from "@/lib/schools-data";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { schoolId, query } = await request.json();

  if (!schoolId) {
    return Response.json({ error: "Missing schoolId" }, { status: 400 });
  }

  const school = getSchoolById(schoolId);
  if (!school) {
    return Response.json({ error: "School not found" }, { status: 404 });
  }

  const searchQuery = query || `Tell me about ${school.name}`;
  const nearbyInfo = `District: ${school.district}, Category: ${school.category}, Enrollment: ${school.enrollment}, Programs: ${school.programs?.map((p) => p.name).join(", ") || "Standard"}`;

  try {
    // Run analysis and photo fetch in parallel
    const [analysis, photoUri] = await Promise.all([
      analyzeSchool(school, searchQuery, nearbyInfo),
      getSchoolPhoto(school.name, school.location.latitude, school.location.longitude).catch(() => null),
    ]);

    return Response.json({ schoolId: school.id, analysis, photoUri });
  } catch (err) {
    console.error(`Analysis failed for ${school.name}:`, err);
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
