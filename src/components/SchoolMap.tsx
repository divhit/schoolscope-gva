"use client";

import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { SchoolPin } from "./SchoolPin";
import type { School } from "@/lib/types";

interface SchoolMapProps {
  schools: School[];
  selectedSchool: School | null;
  onSelectSchool: (school: School) => void;
  userLocation: { lat: number; lng: number } | null;
  accentColor?: string;
}

export function SchoolMap({
  schools,
  selectedSchool,
  onSelectSchool,
  userLocation,
  accentColor,
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
    >
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
