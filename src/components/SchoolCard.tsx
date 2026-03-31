"use client";

import { motion } from "framer-motion";
import type { School, SchoolAnalysis } from "@/lib/types";

interface SchoolCardProps {
  school: School;
  analysis?: SchoolAnalysis;
  photoUri?: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export function SchoolCard({
  school,
  analysis,
  photoUri,
  index,
  isSelected,
  onClick,
}: SchoolCardProps) {
  const categoryColors: Record<string, string> = {
    Elementary: "#4ADE80",
    Secondary: "#60A5FA",
    "K-12": "#A78BFA",
    "French Immersion": "#38BDF8",
    Independent: "#FBBF24",
    Private: "#FBBF24",
    Alternative: "#F472B6",
    Montessori: "#2DD4BF",
    Middle: "#A78BFA",
  };

  const catColor = categoryColors[school.category] ?? "#2D6A4F";
  const score = analysis?.overallScore ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onClick={onClick}
      className={`group relative cursor-pointer rounded-2xl overflow-hidden bg-[var(--surface)] border transition-all duration-300 ${
        isSelected
          ? "border-[var(--accent)] shadow-lg ring-1 ring-[var(--accent)]/20"
          : "border-[var(--border)] hover:border-[var(--border-light)] card-hover"
      }`}
    >
      {/* Photo */}
      <div className="relative h-36 overflow-hidden bg-[var(--surface-2)]">
        {photoUri ? (
          <img
            src={photoUri}
            alt={school.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[var(--border)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}

        {/* Score badge */}
        {score > 0 && (
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color: score >= 70 ? "var(--accent)" : score >= 40 ? "var(--warning)" : "var(--text-muted)" }}>
              {score}
            </span>
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm" style={{ color: catColor }}>
            {school.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[15px] text-[var(--text)] truncate font-semibold">
          {school.name}
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {school.district} &middot; {school.gradeRange} &middot; {school.schoolType}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 text-[11px] text-[var(--text-secondary)]">
          {school.enrollment && (
            <span>{school.enrollment.toLocaleString()} students</span>
          )}
          {school.utilizationRate != null && (
            <span className={school.utilizationRate > 100 ? "text-[var(--danger)]" : ""}>
              {school.utilizationRate}% full
            </span>
          )}
          {school.fciScore != null && (
            <span style={{ color: school.fciScore <= 0.3 ? "var(--accent)" : school.fciScore <= 0.5 ? "var(--warning)" : "var(--danger)" }}>
              FCI {school.fciScore.toFixed(2)}
            </span>
          )}
        </div>

        {/* Programs */}
        {school.programs && school.programs.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {school.programs.slice(0, 2).map((p, i) => (
              <span key={i} className="accent-pill">
                {p.name}
              </span>
            ))}
            {school.programs.length > 2 && (
              <span className="text-[10px] text-[var(--text-muted)] self-center">+{school.programs.length - 2}</span>
            )}
          </div>
        )}

        {/* AI summary */}
        {analysis && (
          <p className="text-[11px] text-[var(--text-secondary)] mt-3 pt-3 border-t border-[var(--border-light)] line-clamp-2 leading-relaxed">
            {analysis.summary}
          </p>
        )}

        {!analysis && score === 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--border-light)] space-y-1.5">
            <div className="h-2 w-full rounded animate-shimmer" />
            <div className="h-2 w-3/4 rounded animate-shimmer" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
