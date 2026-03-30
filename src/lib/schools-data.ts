import type { School, SchoolCategory } from "./types";
import rawData from "./gva-schools-data.json";

/**
 * School data sourced from BC government open data:
 * - BC K-12 Schools Directory (catalogue.data.gov.bc.ca) - locations, French program flags
 * - BC School Contacts (bcschoolcontacts.gov.bc.ca) - principal, phone, email
 * - Student Enrolment & FTE by Grade (catalogue.data.gov.bc.ca) - enrollment by grade, historical trends
 * - Class Size Data (catalogue.data.gov.bc.ca) - average class sizes
 * - Foundation Skills Assessment (catalogue.data.gov.bc.ca) - FSA numeracy & literacy scores (district-level)
 *
 * Data is for the 2024/2025 school year across 11 Greater Vancouver Area districts.
 * Last updated: March 2026
 */

interface RawSchoolRecord {
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

// Map raw JSON to School type
const GVA_SCHOOLS: School[] = (rawData as RawSchoolRecord[]).map((r) => ({
  id: r.id,
  name: r.name,
  address: r.address,
  location: r.location,
  category: r.category as SchoolCategory,
  district: r.district,
  districtNumber: r.districtNumber,
  schoolType: r.schoolType as "Public" | "Independent",
  enrollment: r.enrollment,
  capacity: Math.round(r.enrollment / 0.9), // Estimated from typical 90% utilization
  utilizationRate: 90,
  availableSeats: Math.round(r.enrollment * 0.1),
  gradeRange: r.gradeRange,
  fsaNumeracy: r.fsaNumeracy || undefined,
  fsaLiteracy: r.fsaLiteracy || undefined,
  fsaOverall: r.fsaNumeracy && r.fsaLiteracy ? Math.round((r.fsaNumeracy + r.fsaLiteracy) / 2) : undefined,
  classSize: r.classSize || undefined,
  principal: r.principal || undefined,
  email: r.email || undefined,
  phone: r.phone || undefined,
  programs: r.programs,
  tags: r.tags,
  historicalEnrollment: r.historicalEnrollment,
  enrollmentByGrade: r.enrollmentByGrade,
}));

export function getAllSchools(): School[] {
  return GVA_SCHOOLS;
}

export function getSchoolById(id: string): School | undefined {
  return GVA_SCHOOLS.find((s) => s.id === id);
}

export function getSchoolsByDistrict(district: string): School[] {
  return GVA_SCHOOLS.filter(
    (s) => s.district.toLowerCase() === district.toLowerCase()
  );
}

export function getSchoolsByCategory(category: SchoolCategory): School[] {
  return GVA_SCHOOLS.filter((s) => s.category === category);
}

export function searchSchoolsByName(query: string): School[] {
  const q = query.toLowerCase();
  return GVA_SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

export function getDistrictStats() {
  const districts = [...new Set(GVA_SCHOOLS.map((s) => s.district))];
  return districts.map((d) => {
    const schools = GVA_SCHOOLS.filter((s) => s.district === d);
    const withFSA = schools.filter((s) => s.fsaOverall);
    const avgFSA =
      withFSA.length > 0
        ? withFSA.reduce((sum, s) => sum + (s.fsaOverall ?? 0), 0) / withFSA.length
        : 0;
    return {
      district: d,
      totalSchools: schools.length,
      avgFSA: Math.round(avgFSA),
      avgRating: 0,
      categories: [...new Set(schools.map((s) => s.category))],
    };
  });
}

export function getTopSchools(limit: number = 10): School[] {
  return [...GVA_SCHOOLS]
    .filter((s) => s.fsaOverall && s.fsaOverall > 0)
    .sort((a, b) => (b.fsaOverall ?? 0) - (a.fsaOverall ?? 0))
    .slice(0, limit);
}

export function getSchoolsNear(
  lat: number,
  lng: number,
  radiusKm: number = 5
): School[] {
  return GVA_SCHOOLS.filter((s) => {
    const dist = haversine(lat, lng, s.location.latitude, s.location.longitude);
    return dist <= radiusKm;
  }).sort((a, b) => {
    const da = haversine(lat, lng, a.location.latitude, a.location.longitude);
    const db = haversine(lat, lng, b.location.latitude, b.location.longitude);
    return da - db;
  });
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
