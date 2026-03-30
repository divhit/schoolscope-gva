/**
 * Fetches real school data from BC government open data sources and generates
 * the schools-data.ts file with actual enrollment, FSA, class size, and contact info.
 *
 * Data sources:
 * - BC K-12 Schools with Lat/Lon: catalogue.data.gov.bc.ca
 * - School Contacts: bcschoolcontacts.gov.bc.ca
 * - Student Enrollment by Grade: catalogue.data.gov.bc.ca
 * - Class Size: catalogue.data.gov.bc.ca
 * - FSA Results: catalogue.data.gov.bc.ca
 *
 * Run: npx tsx scripts/fetch-school-data.ts
 */

import { writeFileSync } from "fs";

// GVA district numbers
const GVA_DISTRICTS = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const GVA_DISTRICT_NAMES: Record<number, string> = {
  33: "Chilliwack",
  34: "Abbotsford",
  35: "Langley",
  36: "Surrey",
  37: "Delta",
  38: "Richmond",
  39: "Vancouver",
  40: "New Westminster",
  41: "Burnaby",
  42: "Maple Ridge",
  43: "Coquitlam",
  44: "North Vancouver",
  45: "West Vancouver",
};

// Core GVA districts (excluding Abbotsford and Chilliwack for focused GVA app)
const CORE_GVA = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

interface RawSchool {
  schoolNumber: string;
  name: string;
  districtNumber: number;
  districtName: string;
  publicOrIndependent: string;
  address: string;
  city: string;
  facilityType: string;
  educationLevel: string;
  hasCoreFrench: boolean;
  hasEarlyFrenchImmersion: boolean;
  hasLateFrenchImmersion: boolean;
  hasFrancophone: boolean;
  latitude: number;
  longitude: number;
}

interface ContactInfo {
  principal: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  schoolCategory: string;
  enrollmentByGrade: Record<string, number>;
}

interface EnrollmentRecord {
  schoolYear: string;
  grade: string;
  totalEnrolment: number;
}

interface ClassSizeRecord {
  avgClassSizeAll: number;
  avgClassSizeK: number;
  avgClassSize1to3: number;
  avgClassSize4to7: number;
  avgClassSize8to12: number;
}

interface FSARecord {
  grade: string;
  skill: string;
  numOnTrack: number;
  numExpected: number;
  avgScore: number;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Handle quoted CSV fields
  function parseLine(line: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  }

  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    const record: Record<string, string> = {};
    headers.forEach((h, i) => {
      record[h] = values[i] ?? "";
    });
    return record;
  });
}

async function fetchCSV(url: string, label: string): Promise<Record<string, string>[]> {
  console.log(`Fetching ${label}...`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed to fetch ${label}: ${res.status}`);
    return [];
  }
  const text = await res.text();
  const records = parseCSV(text);
  console.log(`  Got ${records.length} rows`);
  return records;
}

async function main() {
  // 1. Fetch BC K-12 Schools with Lat/Lon
  const schoolsRaw = await fetchCSV(
    "https://catalogue.data.gov.bc.ca/dataset/95da1091-7e8c-4aa6-9c1b-5ab159ea7b42/resource/5832eff2-3380-435e-911b-5ada41c1d30b/download/bc_k12_schools_2026_databc.csv",
    "BC K-12 Schools"
  );

  // Filter to GVA districts
  const gvaSchools: RawSchool[] = schoolsRaw
    .filter((r) => {
      const dn = parseInt(r.DISTRICT_NUMBER);
      return CORE_GVA.includes(dn) && r.SCHOOL_LATITUDE && r.SCHOOL_LONGITUDE;
    })
    .map((r) => ({
      schoolNumber: r.SCHOOL_NUMBER,
      name: r.SCHOOL_NAME,
      districtNumber: parseInt(r.DISTRICT_NUMBER),
      districtName: r.DISTRICT_NAME,
      publicOrIndependent: r.PUBLIC_OR_INDEPENDENT,
      address: r.STREET_ADDRESS ?? "",
      city: r.PHYSICAL_ADDRESS_CITY ?? "",
      facilityType: r.FACILITY_TYPE ?? "",
      educationLevel: r.SCHOOL_EDUCATION_LEVEL ?? "",
      hasCoreFrench: r.HAS_CORE_FRENCH === "YES",
      hasEarlyFrenchImmersion: r.HAS_EARLY_FRENCH_IMMERSION === "YES",
      hasLateFrenchImmersion: r.HAS_LATE_FRENCH_IMMERSION === "YES",
      hasFrancophone: r.HAS_PROG_FRANCOPHONE === "YES",
      latitude: parseFloat(r.SCHOOL_LATITUDE),
      longitude: parseFloat(r.SCHOOL_LONGITUDE),
    }));

  console.log(`\nGVA schools: ${gvaSchools.length}`);

  // 2. Fetch School Contacts
  const contactsRaw = await fetchCSV(
    "https://bcschoolcontacts.gov.bc.ca/api/download/allschoolcontacts.csv",
    "School Contacts"
  );

  const contactsMap = new Map<string, ContactInfo>();
  for (const r of contactsRaw) {
    const code = r["School Code"]?.replace(/^0+/, "");
    if (!code) continue;
    const enrollByGrade: Record<string, number> = {};
    const gradeFields = [
      "Kindergarten Full Enrollment",
      "Grade 1 Enrollment", "Grade 2 Enrollment", "Grade 3 Enrollment",
      "Grade 4 Enrollment", "Grade 5 Enrollment", "Grade 6 Enrollment",
      "Grade 7 Enrollment", "Grade 8 Enrollment", "Grade 9 Enrollment",
      "Grade 10 Enrollment", "Grade 11 Enrollment", "Grade 12 Enrollment",
    ];
    const gradeLabels = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    gradeFields.forEach((field, i) => {
      const val = parseInt(r[field]);
      if (!isNaN(val) && val > 0) {
        enrollByGrade[gradeLabels[i]] = val;
      }
    });

    contactsMap.set(code, {
      principal: `${r["Principal First Name"] ?? ""} ${r["Principal Last Name"] ?? ""}`.trim(),
      phone: r.Phone ?? "",
      email: r.Email ?? "",
      address: r["Physical Address"] || r.Address || "",
      city: r["Physical City"] || r.City || "",
      postalCode: r["Physical Postal Code"] || r["Postal Code"] || "",
      schoolCategory: r["School Category"] ?? "",
      enrollmentByGrade: enrollByGrade,
    });
  }
  console.log(`Contacts mapped: ${contactsMap.size}`);

  // 3. Fetch Enrollment data (most recent)
  const enrollRaw = await fetchCSV(
    "https://catalogue.data.gov.bc.ca/dataset/2c53729a-2453-4633-92f3-6876a45f8bc4/resource/e2debe69-0d03-492f-b2dc-656fbe01cd38/download/student_enrolment_and_fte_2020-21_to_2025_26.csv",
    "Student Enrollment"
  );

  // Group by school number, get latest year per school
  const enrollMap = new Map<string, { byGrade: Map<string, number>; total: number; byYear: Map<string, number> }>();
  for (const r of enrollRaw) {
    if (r.DATA_LEVEL?.toLowerCase() !== "school level") continue;
    const dn = parseInt(r.DISTRICT_NUMBER);
    if (!CORE_GVA.includes(dn)) continue;
    const sn = r.SCHOOL_NUMBER;
    const year = r.SCHOOL_YEAR;
    const grade = r.GRADE;
    const total = parseInt(r.TOTAL_ENROLMENT);
    if (isNaN(total)) continue;

    if (!enrollMap.has(sn)) {
      enrollMap.set(sn, { byGrade: new Map(), total: 0, byYear: new Map() });
    }
    const entry = enrollMap.get(sn)!;

    // Track by year for historical
    if (grade === "All Grades") {
      entry.byYear.set(year, total);
      // Use latest year total
      if (!entry.total || year >= "2024") {
        entry.total = total;
      }
    } else {
      // Use latest year for grade breakdown
      if (year === "2024/2025" || year === "2025/2026") {
        let gradeLabel = grade;
        if (grade === "KF" || grade === "KH") gradeLabel = "K";
        else if (/^\d+$/.test(grade)) gradeLabel = String(parseInt(grade));
        else continue; // skip "All Elementary", "Elementary Ungraded" etc
        entry.byGrade.set(gradeLabel, total);
      }
    }
  }
  console.log(`Enrollment data for ${enrollMap.size} schools`);

  // 4. Fetch Class Size data
  const classSizeRaw = await fetchCSV(
    "https://catalogue.data.gov.bc.ca/dataset/dd2b0390-c77a-4c9f-b1bc-cb8d9f4a23c5/resource/63e52d04-9431-44ea-93d4-5251e04a239c/download/class_size_2006-07_to_2024-25.csv",
    "Class Size"
  );

  const classSizeMap = new Map<string, ClassSizeRecord>();
  for (const r of classSizeRaw) {
    if (r.DATA_LEVEL?.toLowerCase() !== "school level") continue;
    if (r.SCHOOL_YEAR !== "2024/2025" && r.SCHOOL_YEAR !== "2023/2024") continue;
    const sn = r.SCHOOL_NUMBER;
    if (classSizeMap.has(sn) && r.SCHOOL_YEAR < "2024") continue;
    classSizeMap.set(sn, {
      avgClassSizeAll: parseFloat(r.AVG_CLASS_SIZE_ALL_GRADES) || 0,
      avgClassSizeK: parseFloat(r.AVG_CLASS_SIZE_K) || 0,
      avgClassSize1to3: parseFloat(r["AVG_CLASS_SIZE_1_TO_3"]) || 0,
      avgClassSize4to7: parseFloat(r["AVG_CLASS_SIZE_4_TO_7"]) || 0,
      avgClassSize8to12: parseFloat(r["AVG_CLASS_SIZE_8_TO_12"]) || 0,
    });
  }
  console.log(`Class size data for ${classSizeMap.size} schools`);

  // 5. Fetch FSA data
  const fsaRaw = await fetchCSV(
    "https://catalogue.data.gov.bc.ca/dataset/5554165d-e365-422f-bf85-4f6e4c9167dc/resource/d9377320-2c9e-4a3a-ba4a-af84ae3e344c/download/foundational_skills_assessment_2021-22_to_2024-25_residents_only.csv",
    "FSA Results"
  );

  // FSA is only at District Level in this dataset
  const fsaMap = new Map<string, { numeracy: number; literacy: number; count: number }>();
  for (const r of fsaRaw) {
    if (r.DATA_LEVEL?.toLowerCase() !== "district level") continue;
    if (r.SUB_POPULATION !== "All Students") continue;
    // Use most recent year
    if (r.SCHOOL_YEAR !== "2023/2024" && r.SCHOOL_YEAR !== "2024/2025") continue;

    const dn = r.DISTRICT_NUMBER?.trim();
    if (!dn) continue;
    const key = `d${parseInt(dn)}`;
    const onTrack = parseInt(r.NUMBER_ONTRACK) || 0;
    const extending = parseInt(r.NUMBER_EXTENDING) || 0;
    const expected = parseInt(r.NUMBER_EXPECTED_WRITERS) || 0;

    if (expected === 0) continue;

    if (!fsaMap.has(key)) {
      fsaMap.set(key, { numeracy: 0, literacy: 0, count: 0 });
    }
    const entry = fsaMap.get(key)!;
    const pctOnTrack = ((onTrack + extending) / expected) * 100;

    if (r.FSA_SKILL_CODE === "Numeracy") {
      entry.numeracy = Math.max(entry.numeracy, pctOnTrack);
    } else {
      entry.literacy = Math.max(entry.literacy, pctOnTrack);
    }
    entry.count++;
  }
  console.log(`FSA data for ${fsaMap.size} districts`);

  // === BUILD SCHOOL RECORDS ===
  console.log("\n=== Building school records ===");

  interface SchoolRecord {
    id: string;
    name: string;
    address: string;
    location: { latitude: number; longitude: number };
    category: string;
    district: string;
    districtNumber: number;
    schoolType: string;
    enrollment: number;
    gradeRange: string;
    classSize: number;
    fsaNumeracy: number;
    fsaLiteracy: number;
    principal: string;
    email: string;
    phone: string;
    programs: { name: string; description: string }[];
    tags: string[];
    historicalEnrollment: { year: string; count: number }[];
    enrollmentByGrade: { grade: string; count: number }[];
  }

  const schools: SchoolRecord[] = [];

  for (const raw of gvaSchools) {
    // Skip non-standard facility types
    if (raw.facilityType === "DISTANCE EDUCATION" || raw.facilityType === "CONTINUING EDUCATION") continue;
    if (raw.educationLevel === "SENIOR SECONDARY GRADUATED ADULTS") continue;

    const sn = raw.schoolNumber;
    const snPadded = sn.padStart(8, "0");
    const contact = contactsMap.get(sn) ?? contactsMap.get(snPadded) ?? contactsMap.get(sn.replace(/^0+/, ""));
    const enrollment = enrollMap.get(sn) ?? enrollMap.get(snPadded);
    const classSize = classSizeMap.get(sn) ?? classSizeMap.get(snPadded);
    const fsa = fsaMap.get(sn) ?? fsaMap.get(snPadded) ?? fsaMap.get(`d${raw.districtNumber}`);

    // Determine category
    let category = "Elementary";
    if (raw.educationLevel.includes("SECONDARY") && !raw.educationLevel.includes("ELEMENTARY")) {
      category = "Secondary";
    } else if (raw.educationLevel.includes("MIDDLE")) {
      category = "Middle";
    } else if (raw.educationLevel.includes("SECONDARY") && raw.educationLevel.includes("ELEMENTARY")) {
      category = "K-12";
    }
    if (raw.hasEarlyFrenchImmersion || raw.hasLateFrenchImmersion) {
      // Keep main category but add program
    }

    // Grade range
    let gradeRange = "K-7";
    if (category === "Secondary") gradeRange = "8-12";
    else if (category === "K-12") gradeRange = "K-12";
    else if (category === "Middle") gradeRange = "6-8";
    if (contact?.enrollmentByGrade) {
      const grades = Object.keys(contact.enrollmentByGrade);
      if (grades.length > 0) {
        const first = grades[0];
        const last = grades[grades.length - 1];
        gradeRange = `${first}-${last}`;
      }
    }

    // Programs
    const programs: { name: string; description: string }[] = [];
    if (raw.hasCoreFrench) programs.push({ name: "Core French", description: "French as a second language instruction" });
    if (raw.hasEarlyFrenchImmersion) programs.push({ name: "Early French Immersion", description: "Full French immersion starting in Kindergarten" });
    if (raw.hasLateFrenchImmersion) programs.push({ name: "Late French Immersion", description: "French immersion starting in Grade 6" });
    if (raw.hasFrancophone) programs.push({ name: "Programme Francophone", description: "French-first language program (CSF)" });

    // Tags
    const tags: string[] = [];
    if (raw.publicOrIndependent === "INDEPENDENT") tags.push("independent");
    if (raw.hasEarlyFrenchImmersion || raw.hasLateFrenchImmersion) tags.push("french-immersion");
    tags.push(raw.city.toLowerCase().replace(/\s+/g, "-"));

    // Historical enrollment
    const histEnroll: { year: string; count: number }[] = [];
    if (enrollment?.byYear) {
      const sorted = [...enrollment.byYear.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      for (const [year, count] of sorted) {
        histEnroll.push({ year, count });
      }
    }

    // Enrollment by grade (from enrollment CSV, not contacts)
    const gradeEnroll: { grade: string; count: number }[] = [];
    if (enrollment?.byGrade && enrollment.byGrade.size > 0) {
      // Sort grades properly: K, 1, 2, ... 12
      const sortedGrades = [...enrollment.byGrade.entries()].sort((a, b) => {
        if (a[0] === "K") return -1;
        if (b[0] === "K") return 1;
        return parseInt(a[0]) - parseInt(b[0]);
      });
      for (const [grade, count] of sortedGrades) {
        if (count > 0) gradeEnroll.push({ grade, count });
      }
    }

    const totalEnroll = enrollment?.total ?? gradeEnroll.reduce((s, g) => s + g.count, 0);
    if (totalEnroll === 0) continue; // Skip schools with no enrollment data

    const id = `s${raw.districtNumber}-${sn}`;
    const fullAddress = contact
      ? `${contact.address}, ${contact.city}, BC ${contact.postalCode}`.trim()
      : `${raw.address}, ${raw.city}, BC`;

    schools.push({
      id,
      name: raw.name,
      address: fullAddress,
      location: { latitude: raw.latitude, longitude: raw.longitude },
      category,
      district: GVA_DISTRICT_NAMES[raw.districtNumber] ?? raw.districtName,
      districtNumber: raw.districtNumber,
      schoolType: raw.publicOrIndependent === "INDEPENDENT" ? "Independent" : "Public",
      enrollment: totalEnroll,
      gradeRange,
      classSize: Math.round(classSize?.avgClassSizeAll || 0),
      fsaNumeracy: Math.round(fsa?.numeracy || 0),
      fsaLiteracy: Math.round(fsa?.literacy || 0),
      principal: contact?.principal ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      programs,
      tags,
      historicalEnrollment: histEnroll,
      enrollmentByGrade: gradeEnroll,
    });
  }

  console.log(`\nTotal schools with data: ${schools.length}`);
  console.log(`Districts: ${[...new Set(schools.map((s) => s.district))].join(", ")}`);

  // Write output JSON
  const outputPath = "scripts/gva-schools-data.json";
  writeFileSync(outputPath, JSON.stringify(schools, null, 2));
  console.log(`\nWrote ${outputPath} (${schools.length} schools)`);

  // Print stats
  const withEnroll = schools.filter((s) => s.enrollment > 0).length;
  const withContact = schools.filter((s) => s.principal).length;
  const withFSA = schools.filter((s) => s.fsaNumeracy > 0 || s.fsaLiteracy > 0).length;
  const withClassSize = schools.filter((s) => s.classSize > 0).length;
  const withHistorical = schools.filter((s) => s.historicalEnrollment.length > 0).length;
  const withGradeBreakdown = schools.filter((s) => s.enrollmentByGrade.length > 0).length;

  console.log(`\n=== Data Coverage ===`);
  console.log(`With enrollment:       ${withEnroll}/${schools.length}`);
  console.log(`With contact info:     ${withContact}/${schools.length}`);
  console.log(`With FSA scores:       ${withFSA}/${schools.length}`);
  console.log(`With class size:       ${withClassSize}/${schools.length}`);
  console.log(`With historical data:  ${withHistorical}/${schools.length}`);
  console.log(`With grade breakdown:  ${withGradeBreakdown}/${schools.length}`);
}

main().catch(console.error);
