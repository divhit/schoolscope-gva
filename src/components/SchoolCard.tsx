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
    Elementary: "#34d399",
    Secondary: "#6366f1",
    "K-12": "#a78bfa",
    "French Immersion": "#3b82f6",
    Independent: "#f59e0b",
    Private: "#f59e0b",
    Alternative: "#ec4899",
    Montessori: "#14b8a6",
    Middle: "#8b5cf6",
  };

  const catColor = categoryColors[school.category] ?? "#6366f1";
  const score = analysis?.overallScore ?? school.fsaOverall ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
      className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
        isSelected
          ? "ring-2 ring-accent shadow-lg shadow-accent/10"
          : "hover:ring-1 hover:ring-white/10"
      }`}
    >
      {/* Photo / gradient header */}
      <div className="relative h-32 overflow-hidden">
        {photoUri ? (
          <img
            src={photoUri}
            alt={school.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${catColor}22, ${catColor}08)`,
            }}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />

        {/* Score badge */}
        {score > 0 && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{
              background: `${analysis?.accentColor ?? catColor}22`,
              color: analysis?.accentColor ?? catColor,
              border: `1px solid ${analysis?.accentColor ?? catColor}33`,
            }}
          >
            {score}
          </div>
        )}

        {/* Category pill */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: `${catColor}22`,
            color: catColor,
          }}
        >
          {school.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-surface">
        <h3 className="font-semibold text-sm text-white truncate font-[family-name:var(--font-space-grotesk)]">
          {school.name}
        </h3>
        <p className="text-xs text-text-secondary mt-1 truncate">
          {school.district} · {school.address.split(",")[0]}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3">
          {school.enrollment && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[11px] text-text-secondary">{school.enrollment}</span>
            </div>
          )}
          {school.classSize && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-[11px] text-text-secondary">~{school.classSize}/class</span>
            </div>
          )}
          {school.rating && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[11px] text-text-secondary">{school.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* AI Analysis preview */}
        {analysis && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
              {analysis.summary}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {analysis.bestFor.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Loading shimmer if analyzing */}
        {!analysis && (
          <div className="mt-3 space-y-2">
            <div className="h-2 w-full rounded animate-shimmer" />
            <div className="h-2 w-3/4 rounded animate-shimmer" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
