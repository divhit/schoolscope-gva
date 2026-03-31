"use client";

import { useEffect, useState } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { SchoolPin } from "./SchoolPin";
import type { School } from "@/lib/types";

interface SchoolMapProps {
  schools: School[];
  selectedSchool: School | null;
  onSelectSchool: (school: School) => void;
  userLocation: { lat: number; lng: number } | null;
  accentColor?: string;
  showNeighborhoods?: boolean;
  onMapMove?: (center: { lat: number; lng: number }) => void;
}

// Neighborhood colors
const HOOD_COLORS: Record<string, string> = {
  "Kitsilano": "#6366f133",
  "West Point Grey": "#a78bfa33",
  "Dunbar-Southlands": "#34d39933",
  "Kerrisdale": "#fbbf2433",
  "Shaughnessy": "#f59e0b33",
  "Arbutus Ridge": "#14b8a633",
  "Fairview": "#3b82f633",
  "Mount Pleasant": "#ec489933",
  "Riley Park": "#8b5cf633",
  "Kensington-Cedar Cottage": "#f9731633",
  "Hastings-Sunrise": "#06b6d433",
  "Grandview-Woodland": "#84cc1633",
  "Strathcona": "#ef444433",
  "Downtown": "#64748b33",
  "West End": "#0ea5e933",
  "South Cambie": "#d946ef33",
  "Oakridge": "#10b98133",
  "Marpole": "#f4364633",
  "Sunset": "#eab30833",
  "Victoria-Fraserview": "#22d3ee33",
  "Killarney": "#a3e63533",
  "Renfrew-Collingwood": "#fb923c33",
};

const HOOD_BORDER_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(HOOD_COLORS).map(([k, v]) => [k, v.replace("33", "88")])
);

interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    name: string;
    [key: string]: unknown;
  };
}

function NeighborhoodOverlay() {
  const map = useMap();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!map || loaded) return;

    fetch("/data/vancouver-neighborhoods.geojson")
      .then((res) => res.json())
      .then((geojson: { features: GeoJSONFeature[] }) => {
        geojson.features.forEach((feature) => {
          try {
            const name = feature.properties.name;
            const fillColor = HOOD_COLORS[name] ?? "#6366f120";
            const strokeColor = HOOD_BORDER_COLORS[name] ?? "#6366f155";

            if (feature.geometry.type === "Polygon") {
              const coords = (feature.geometry.coordinates as number[][][])[0];
              const path = coords.map(([lng, lat]) => ({ lat, lng }));

              const polygon = new google.maps.Polygon({
                paths: path,
                fillColor,
                fillOpacity: 0.25,
                strokeColor,
                strokeOpacity: 0.6,
                strokeWeight: 1.5,
                map,
              });

              polygon.addListener("mouseover", () => {
                polygon.setOptions({ fillOpacity: 0.45, strokeWeight: 2.5 });
              });
              polygon.addListener("mouseout", () => {
                polygon.setOptions({ fillOpacity: 0.25, strokeWeight: 1.5 });
              });
            }
          } catch (e) {
            // Skip individual polygon errors silently
          }
        });

        setLoaded(true);
      })
      .catch(() => {
        // Neighborhood overlay is optional — don't break the map
        setLoaded(true);
      });
  }, [map, loaded]);

  return null;
}

function MapPanner({ location }: { location: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && location) {
      map.panTo(location);
      map.setZoom(14);
    }
  }, [map, location]);
  return null;
}

export function SchoolMap({
  schools,
  selectedSchool,
  onSelectSchool,
  userLocation,
  accentColor,
  showNeighborhoods = true,
  onMapMove,
}: SchoolMapProps) {
  const center = userLocation ?? { lat: 49.2527, lng: -123.0907 };

  return (
    <Map
      defaultCenter={center}
      defaultZoom={11}
      gestureHandling="greedy"
      disableDefaultUI
      className="h-full w-full rounded-2xl"
      colorScheme="DARK"
      mapId="schoolscope-dark"
      onIdle={(e) => {
        if (onMapMove && e.map) {
          const c = e.map.getCenter();
          if (c) onMapMove({ lat: c.lat(), lng: c.lng() });
        }
      }}
    >
      <MapPanner location={userLocation} />
      {showNeighborhoods && <NeighborhoodOverlay />}

      {userLocation && (
        <AdvancedMarker position={userLocation}>
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-accent shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
            <div className="absolute inset-0 h-4 w-4 rounded-full bg-accent/40 animate-ping" />
          </div>
        </AdvancedMarker>
      )}

      {schools.map((school) => (
        <AdvancedMarker
          key={school.id}
          position={{
            lat: school.location.latitude,
            lng: school.location.longitude,
          }}
          onClick={() => onSelectSchool(school)}
        >
          <SchoolPin
            school={school}
            isSelected={selectedSchool?.id === school.id}
            accentColor={accentColor}
          />
        </AdvancedMarker>
      ))}
    </Map>
  );
}
