/**
 * Uses Gemini to accurately match program data to schools by school number.
 * No fuzzy string matching — Gemini resolves name variations.
 *
 * Run: npx tsx scripts/match-programs-with-gemini.ts
 */

import { writeFileSync, readFileSync } from "fs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

interface SchoolEntry {
  id: string;
  name: string;
  district: string;
  districtNumber: number;
}

interface ProgramSource {
  schoolName: string;
  district?: string;
  programs: { name: string; description: string; source?: string }[];
}

async function askGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0, responseMimeType: "application/json" },
      }),
    }
  );
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
}

async function main() {
  // Load school list
  const allSchools: SchoolEntry[] = JSON.parse(readFileSync("scripts/gva-schools-data.json", "utf-8"))
    .map((s: { id: string; name: string; district: string; districtNumber: number }) => ({
      id: s.id, name: s.name, district: s.district, districtNumber: s.districtNumber,
    }));

  console.log(`Schools: ${allSchools.length}`);

  // Load all program sources
  const ibAp: ProgramSource[] = JSON.parse(readFileSync("scripts/ib-ap-verified.json", "utf-8"))
    .map((e: { schoolName: string; district: string; programs: { name: string; description: string }[] }) => ({
      schoolName: e.schoolName, district: e.district, programs: e.programs,
    }));

  const vsbScraped: ProgramSource[] = JSON.parse(readFileSync("scripts/vsb-programs-scraped.json", "utf-8"))
    .map((e: { schoolName: string; programs: { name: string; description: string }[] }) => ({
      schoolName: e.schoolName, district: "Vancouver", programs: e.programs,
    }));

  const allProgSources = [...ibAp, ...vsbScraped];
  console.log(`Program sources: ${allProgSources.length} entries`);

  // Build school name list per district for Gemini
  const districtSchools: Record<string, { id: string; name: string }[]> = {};
  for (const s of allSchools) {
    const key = String(s.districtNumber);
    if (!districtSchools[key]) districtSchools[key] = [];
    districtSchools[key].push({ id: s.id, name: s.name });
  }

  // Process in batches by district
  const finalMapping: Record<string, { name: string; description: string }[]> = {};
  const batchSize = 15;

  for (let i = 0; i < allProgSources.length; i += batchSize) {
    const batch = allProgSources.slice(i, i + batchSize);
    console.log(`\nBatch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allProgSources.length / batchSize)}: ${batch.map(b => b.schoolName).join(', ').slice(0, 80)}...`);

    // Build the school list context
    const relevantSchools: { id: string; name: string }[] = [];
    const seenIds = new Set<string>();
    for (const src of batch) {
      // Get district number from district name
      const distNum = src.district?.match(/\d+/)?.[0];
      const possibleDists = distNum ? [distNum] : Object.keys(districtSchools);
      for (const d of possibleDists) {
        for (const s of (districtSchools[d] ?? [])) {
          if (!seenIds.has(s.id)) {
            seenIds.add(s.id);
            relevantSchools.push(s);
          }
        }
      }
    }

    const prompt = `You are matching school program data to a database of schools. For each program source entry, find the EXACT matching school ID from the database.

SCHOOL DATABASE (id → name):
${relevantSchools.map(s => `${s.id}: ${s.name}`).join('\n')}

PROGRAM SOURCES TO MATCH:
${batch.map((b, idx) => `[${idx}] "${b.schoolName}" (${b.district ?? 'unknown district'}) → Programs: ${b.programs.map(p => p.name).join(', ')}`).join('\n')}

For each program source [0], [1], etc., return the matching school ID from the database. If no match exists (e.g., independent school not in the public school database), return null.

Be careful:
- "Britannia Secondary School" matches "Britannia Community Secondary" (same school, different name format)
- "Sir Winston Churchill Secondary School" matches "Sir Winston Churchill Secondary"
- "Semiahmoo Secondary School" should NOT match "Semiahmoo Trail Elementary" (different school!)
- "Churchill" in a school name should match "Sir Winston Churchill Secondary", NOT "Janice Churchill Elementary"
- Match on the DISTINCTIVE part of the name, not common words like "Elementary" or "Secondary"

Return JSON array: [{"index": 0, "schoolId": "s39-3939004", "confidence": "high"}, ...]
Only return matches with "high" or "medium" confidence. Skip uncertain matches.`;

    try {
      const result = await askGemini(prompt);
      const matches: { index: number; schoolId: string; confidence: string }[] = JSON.parse(result);

      for (const match of matches) {
        if (!match.schoolId || match.confidence === "low") continue;
        const src = batch[match.index];
        if (!src) continue;

        if (!finalMapping[match.schoolId]) finalMapping[match.schoolId] = [];
        for (const prog of src.programs) {
          if (!finalMapping[match.schoolId].some(p => p.name === prog.name)) {
            finalMapping[match.schoolId].push({ name: prog.name, description: prog.description });
          }
        }
      }

      console.log(`  Matched: ${matches.filter(m => m.schoolId && m.confidence !== "low").length}/${batch.length}`);
    } catch (err) {
      console.error(`  Batch failed:`, err);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 1000));
  }

  // Write output
  const outputPath = "scripts/programs-matched.json";
  writeFileSync(outputPath, JSON.stringify(finalMapping, null, 2));

  const totalSchools = Object.keys(finalMapping).length;
  const totalPrograms = Object.values(finalMapping).reduce((s, p) => s + p.length, 0);
  console.log(`\n=== DONE ===`);
  console.log(`Schools with programs: ${totalSchools}`);
  console.log(`Total program entries: ${totalPrograms}`);
  console.log(`Wrote: ${outputPath}`);
}

main().catch(console.error);
