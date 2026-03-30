const API_KEY = process.env.GOOGLE_MAPS_API_KEY!;
const BASE = "https://places.googleapis.com/v1";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.types",
  "places.rating",
  "places.userRatingCount",
  "places.photos",
  "places.websiteUri",
].join(",");

interface PlacesResponse {
  places?: Array<{
    id: string;
    displayName: { text: string };
    formattedAddress: string;
    location: { latitude: number; longitude: number };
    types: string[];
    rating?: number;
    userRatingCount?: number;
    photos?: Array<{ name: string }>;
    websiteUri?: string;
  }>;
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
  location: { latitude: number; longitude: number };
}

export async function searchNearbyAmenities(
  latitude: number,
  longitude: number,
  query: string,
  radius: number = 2000
): Promise<NearbyPlace[]> {
  const response = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.displayName,places.location,places.types",
    },
    body: JSON.stringify({
      textQuery: query,
      locationBias: {
        circle: { center: { latitude, longitude }, radius },
      },
      pageSize: 5,
      languageCode: "en",
    }),
  });

  if (!response.ok) return [];

  const data: PlacesResponse = await response.json();

  return (data.places ?? []).map((p) => ({
    name: p.displayName.text,
    type: p.types?.[0] ?? query,
    distance: haversineMeters(
      latitude,
      longitude,
      p.location.latitude,
      p.location.longitude
    ),
    location: p.location,
  }));
}

export async function getSchoolPhoto(
  schoolName: string,
  latitude: number,
  longitude: number
): Promise<string | null> {
  const response = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.photos",
    },
    body: JSON.stringify({
      textQuery: schoolName,
      locationBias: {
        circle: { center: { latitude, longitude }, radius: 500 },
      },
      pageSize: 1,
      languageCode: "en",
    }),
  });

  if (!response.ok) return null;

  const data: PlacesResponse = await response.json();
  const photoName = data.places?.[0]?.photos?.[0]?.name;
  if (!photoName) return null;

  return `${BASE}/${photoName}/media?maxWidthPx=800&key=${API_KEY}`;
}

export async function enrichSchoolWithNearby(
  latitude: number,
  longitude: number
): Promise<string> {
  const [parks, libraries, transit] = await Promise.all([
    searchNearbyAmenities(latitude, longitude, "park playground", 1500),
    searchNearbyAmenities(latitude, longitude, "public library", 3000),
    searchNearbyAmenities(latitude, longitude, "bus stop skytrain station", 1000),
  ]);

  const parts: string[] = [];
  if (parks.length > 0) {
    parts.push(`Parks: ${parks.slice(0, 3).map((p) => `${p.name} (${Math.round(p.distance)}m)`).join(", ")}`);
  }
  if (libraries.length > 0) {
    parts.push(`Libraries: ${libraries.slice(0, 2).map((l) => `${l.name} (${Math.round(l.distance)}m)`).join(", ")}`);
  }
  if (transit.length > 0) {
    parts.push(`Transit: ${transit.slice(0, 3).map((t) => `${t.name} (${Math.round(t.distance)}m)`).join(", ")}`);
  }

  return parts.join(" | ") || "No nearby amenity data available";
}

function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
