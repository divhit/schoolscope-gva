export interface School {
  id: string;
  name: string;
  address: string;
  location: { latitude: number; longitude: number };
  category: SchoolCategory;
  district: string;
  enrollment?: number;
  capacity?: number;
  fsaReading?: number;
  fsaWriting?: number;
  fsaNumeracy?: number;
  fsaOverall?: number;
  rating?: number;
  classSize?: number;
  photoUri?: string;
  photoName?: string;
  websiteUri?: string;
  phone?: string;
  nearbyAmenities?: NearbyAmenities;
  transitScore?: number;
  catchmentGeoJSON?: unknown;
  tags?: string[];
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
  distance: number; // meters
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

export interface ComparisonResult {
  schools: School[];
  analysis: {
    winner: string;
    categories: {
      name: string;
      leader: string;
      explanation: string;
    }[];
    recommendation: string;
  };
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
