/**
 * Build accurate program-to-school mapping using normalized name matching.
 * No fuzzy matching — uses exact normalization rules.
 */

import { writeFileSync, readFileSync } from "fs";

interface School {
  id: string;
  name: string;
  district: string;
  districtNumber: number;
}

interface ProgramEntry {
  name: string;
  description: string;
}

// Normalize school name for matching
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/é/g, "e")
    .replace(/['']/g, "'")
    .replace(/\bschool\b/g, "")
    .replace(/\belementary\b/g, "")
    .replace(/\bsecondary\b/g, "")
    .replace(/\bcommunity\b/g, "")
    .replace(/\bannex\b/g, "")
    .replace(/\becole\b/g, "")
    .replace(/\bprimary\b/g, "")
    .replace(/\bthe\b/g, "")
    .replace(/\bst\.\b/g, "st")
    .replace(/\bdr\.\b/g, "dr")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract the distinctive part of a name (skip titles like Sir, Lord, Dr)
function distinctive(name: string): string[] {
  const norm = normalize(name);
  const words = norm.split(" ").filter(w => w.length > 2);
  // Remove common prefixes
  const skip = new Set(["sir", "lord", "dr", "general", "captain", "chief", "prince", "queen", "king", "david", "william", "john", "james", "robert", "henry"]);
  const distinctive = words.filter(w => !skip.has(w));
  return distinctive.length > 0 ? distinctive : words;
}

function main() {
  const schools: School[] = JSON.parse(readFileSync("scripts/gva-schools-data.json", "utf-8"));
  console.log(`Schools: ${schools.length}`);

  // Build lookup: normalized name → school id
  const nameToId = new Map<string, string>();
  const distWords = new Map<string, string[]>(); // id → distinctive words

  for (const s of schools) {
    nameToId.set(normalize(s.name), s.id);
    distWords.set(s.id, distinctive(s.name));
  }

  // Load sources
  const ibAp = JSON.parse(readFileSync("scripts/ib-ap-verified.json", "utf-8"));
  const vsbScraped = JSON.parse(readFileSync("scripts/vsb-programs-scraped.json", "utf-8"));

  const mapping: Record<string, ProgramEntry[]> = {};
  let matched = 0, unmatched = 0;

  function findSchool(sourceName: string, sourceDistrict?: string): string | null {
    // 1. Try exact normalized match
    const norm = normalize(sourceName);
    const exactId = nameToId.get(norm);
    if (exactId) return exactId;

    // 2. Try finding a school whose normalized name contains the source's distinctive words
    const srcDistinctive = distinctive(sourceName);
    if (srcDistinctive.length === 0) return null;

    const candidates: { id: string; score: number }[] = [];
    for (const s of schools) {
      const sNorm = normalize(s.name);
      const sWords = distinctive(s.name);

      // All distinctive source words must appear in school name
      const allMatch = srcDistinctive.every(w => sNorm.includes(w));
      if (!allMatch) continue;

      // Prefer same district
      let score = srcDistinctive.length;
      if (sourceDistrict) {
        const distMatch = sourceDistrict.toLowerCase().includes(s.district.toLowerCase()) ||
          s.district.toLowerCase().includes(sourceDistrict.replace(/\s*\(SD\d+\)/g, "").trim().toLowerCase());
        if (distMatch) score += 10;
      }

      // Prefer same education level
      const srcIsElementary = sourceName.toLowerCase().includes("elementary") || sourceName.toLowerCase().includes("primary");
      const srcIsSecondary = sourceName.toLowerCase().includes("secondary");
      const sIsElementary = s.name.toLowerCase().includes("elementary") || s.name.toLowerCase().includes("primary");
      const sIsSecondary = s.name.toLowerCase().includes("secondary");

      if (srcIsElementary && sIsElementary) score += 5;
      if (srcIsSecondary && sIsSecondary) score += 5;
      if (srcIsElementary && sIsSecondary) score -= 20; // WRONG level
      if (srcIsSecondary && sIsElementary) score -= 20; // WRONG level

      candidates.push({ id: s.id, score });
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);

    // Only return if top candidate has a good score and is significantly better than #2
    const top = candidates[0];
    if (top.score < 0) return null;
    if (candidates.length > 1 && candidates[1].score === top.score) {
      // Ambiguous — skip
      return null;
    }
    return top.id;
  }

  function addPrograms(schoolId: string, programs: ProgramEntry[]) {
    if (!mapping[schoolId]) mapping[schoolId] = [];
    for (const prog of programs) {
      if (!mapping[schoolId].some(p => p.name === prog.name)) {
        mapping[schoolId].push(prog);
      }
    }
  }

  // Process IB/AP verified data
  console.log("\n=== IB/AP Verified ===");
  for (const entry of ibAp) {
    const id = findSchool(entry.schoolName, entry.district);
    if (id) {
      addPrograms(id, entry.programs);
      matched++;
    } else {
      console.log(`  UNMATCHED: ${entry.schoolName} (${entry.district})`);
      unmatched++;
    }
  }

  // Process VSB scraped data
  console.log("\n=== VSB Scraped ===");
  for (const entry of vsbScraped) {
    const id = findSchool(entry.schoolName, "Vancouver (SD39)");
    if (id) {
      addPrograms(id, entry.programs);
      matched++;
    } else {
      console.log(`  UNMATCHED: ${entry.schoolName}`);
      unmatched++;
    }
  }

  console.log(`\nMatched: ${matched}, Unmatched: ${unmatched}`);

  // Write output
  writeFileSync("scripts/programs-matched.json", JSON.stringify(mapping, null, 2));

  const totalSchools = Object.keys(mapping).length;
  const totalPrograms = Object.values(mapping).reduce((s, p) => s + p.length, 0);
  console.log(`\nOutput: ${totalSchools} schools, ${totalPrograms} programs`);

  // Verify no false positives
  console.log("\n=== Verification ===");
  for (const [id, progs] of Object.entries(mapping)) {
    const school = schools.find(s => s.id === id);
    const hasIB = progs.some(p => p.name.includes("IB") || p.name.includes("International Baccalaureate"));
    if (hasIB && school) {
      const isElementary = school.name.includes("Elementary") || school.name.includes("Primary") || school.name.includes("Annex");
      const hasDP = progs.some(p => p.name.includes("Diploma"));
      if (isElementary && hasDP) {
        console.log(`  WARNING: Elementary school with IB DP: ${school.name}`);
      }
    }
  }
}

main();
