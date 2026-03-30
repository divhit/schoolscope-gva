"use client";

import type { School } from "@/lib/types";

interface SchoolPinProps {
  school: School;
  isSelected: boolean;
  accentColor?: string;
}

export function SchoolPin({ school, isSelected, accentColor }: SchoolPinProps) {
  const rating = school.fsaOverall ?? school.rating ? (school.rating ?? 0) * 10 : 50;

  let color: string;
  if (rating >= 85) color = "#34d399";
  else if (rating >= 70) color = accentColor ?? "#6366f1";
  else if (rating >= 55) color = "#fbbf24";
  else color = "#8888a0";

  const isPrivate = school.category === "Independent";
  const isElementary = school.category === "Elementary" || school.category === "French Immersion";

  return (
    <div className="relative group cursor-pointer">
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="glass rounded-lg px-3 py-2 whitespace-nowrap">
          <p className="text-xs font-medium text-white">{school.name}</p>
          <p className="text-[10px] text-text-secondary">{school.category} · {school.district}</p>
        </div>
      </div>

      {/* Pin */}
      <div
        className="flex items-center justify-center transition-transform duration-200"
        style={{
          transform: isSelected ? "scale(1.3)" : "scale(1)",
        }}
      >
        <div
          className="relative flex items-center justify-center rounded-full border-2"
          style={{
            width: isSelected ? 40 : 32,
            height: isSelected ? 40 : 32,
            backgroundColor: `${color}22`,
            borderColor: color,
            boxShadow: isSelected ? `0 0 16px ${color}55` : "none",
          }}
        >
          <span className="text-xs font-bold" style={{ color }}>
            {isPrivate ? "P" : isElementary ? "E" : "S"}
          </span>
        </div>
      </div>
    </div>
  );
}
