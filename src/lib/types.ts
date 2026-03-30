export interface School {
  id: string;
  name: string;
  address: string;
  location: { latitude: number; longitude: number };
  category: SchoolCategory;
  district: string;
  districtNumber: number;
  schoolType: "Public" | "Independent" | "Francophone";

  // Enrollment & Capacity
  enrollment?: number;
  capacity?: number;
  utilizationRate?: number; // percentage
  availableSeats?: number;
  gradeRange: string; // e.g. "K-7", "8-12", "K-12"

  // Academics
  fsaReading?: number;
  fsaWriting?: number;
  fsaNumeracy?: number;
  fsaOverall?: number;
  rating?: number;
  classSize?: number;

  // Facility
  fciScore?: number; // 0.0 (new) to 1.0 (needs replacement)
  buildingCondition?: "Good" | "Fair" | "Poor" | "Critical";
  seismicRisk?: "High" | "Medium" | "Low" | "Upgrades Complete";

  // Programs
  programs?: SchoolProgram[];

  // Contact
  principal?: string;
  email?: string;
  phone?: string;
  websiteUri?: string;

  // Media
  photoUri?: string;
  photoName?: string;

  // Nearby
  nearbyAmenities?: NearbyAmenities;
  transitScore?: number;

  // Tags
  tags?: string[];

  // Historical enrollment (for charts)
  historicalEnrollment?: { year: string; count: number }[];
  enrollmentByGrade?: { grade: string; count: number }[];
}

export interface SchoolProgram {
  name: string;
  description: string;
  url?: string;
}

export type SchoolCategory =
  | "Elementary"
  | "Secondary"
  | "K-12"
  | "Middle"
  | "Alternative"
  | "French Immersion"
  | "Montessori"
  | "Private"
  | "Independent";

export interface NearbyAmenities {
  parks: AmenityItem[];
  libraries: AmenityItem[];
  communityCentres: AmenityItem[];
  transitStops: TransitStop[];
}

export interface AmenityItem {
  name: string;
  distance: number;
  location: { latitude: number; longitude: number };
}

export interface TransitStop {
  name: string;
  routes: string[];
  distance: number;
  location: { latitude: number; longitude: number };
}

export interface SchoolAnalysis {
  summary: string;
  strengths: string[];
  considerations: string[];
  neighborhoodVibe: string;
  bestFor: string[];
  transitAccessibility: string;
  nearbyHighlights: string[];
  overallScore: number;
  accentColor: string;
}

export interface SearchInterpretation {
  searchTerms: string[];
  schoolTypes: SchoolCategory[];
  priorities: string[];
  neighborhoods: string[];
  summary: string;
  accentColor: string;
}

export type AppState =
  | "idle"
  | "interpreting"
  | "searching"
  | "analyzing"
  | "results";

export interface SearchRequest {
  query: string;
  latitude: number;
  longitude: number;
  radius?: number;
}
