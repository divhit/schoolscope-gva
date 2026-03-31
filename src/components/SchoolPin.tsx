"use client";

import type { School } from "@/lib/types";

interface SchoolPinProps {
  school: School;
  isSelected: boolean;
  accentColor?: string;
}

export function SchoolPin({ school, isSelected }: SchoolPinProps) {
  const isPrivate = school.category === "Independent";
  const isElementary = school.category === "Elementary" || school.category === "French Immersion";

  return (
    <div className="relative group cursor-pointer">
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="bg-white rounded-lg px-3 py-2 shadow-lg border border-[var(--border-light)] whitespace-nowrap">
          <p className="text-xs font-semibold text-[var(--text)]">{school.name}</p>
          <p className="text-[10px] text-[var(--text-muted)]">{school.category} &middot; {school.district}</p>
        </div>
      </div>

      {/* Pin */}
      <div
        className="flex items-center justify-center transition-transform duration-200"
        style={{ transform: isSelected ? "scale(1.4)" : "scale(1)" }}
      >
        <div
          className="relative flex items-center justify-center rounded-full border-2 bg-white shadow-md"
          style={{
            width: isSelected ? 36 : 28,
            height: isSelected ? 36 : 28,
            borderColor: isSelected ? "var(--accent)" : isPrivate ? "#92400E" : "var(--accent-light)",
          }}
        >
          <span className="text-[10px] font-bold" style={{ color: isPrivate ? "#92400E" : "var(--accent)" }}>
            {isPrivate ? "P" : isElementary ? "E" : "S"}
          </span>
        </div>
      </div>
    </div>
  );
}
