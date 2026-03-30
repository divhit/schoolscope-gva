"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { School, SchoolAnalysis } from "@/lib/types";

interface SchoolDetailProps {
  school: School | null;
  analysis?: SchoolAnalysis;
  photoUri?: string;
  onClose: () => void;
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs font-medium" style={{ color }}>{value}</span>
      </div>
      <div className="stat-bar">
        <div
          className="stat-bar-fill"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function SchoolDetail({ school, analysis, photoUri, onClose }: SchoolDetailProps) {
  if (!school) return null;

  const accentColor = analysis?.accentColor ?? "#6366f1";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-end"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative h-full w-full max-w-lg bg-surface overflow-y-auto"
        >
          {/* Header image */}
          <div className="relative h-56">
            {photoUri ? (
              <img src={photoUri} alt={school.name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}08)`,
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* School name overlay */}
            <div className="absolute bottom-4 left-5 right-5">
              <div
                className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider mb-2"
                style={{ background: `${accentColor}22`, color: accentColor }}
              >
                {school.category} · {school.district}
              </div>
              <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                {school.name}
              </h2>
              <p className="text-sm text-text-secondary mt-1">{school.address}</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pb-8 space-y-6">
            {/* Score ring */}
            {analysis && (
              <div className="flex items-center gap-4 -mt-2">
                <div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${accentColor} ${analysis.overallScore * 3.6}deg, var(--surface-3) 0deg)`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center">
                    <span className="text-lg font-bold" style={{ color: accentColor }}>
                      {analysis.overallScore}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Match Score</p>
                  <p className="text-xs text-text-secondary mt-0.5">{analysis.summary.slice(0, 100)}...</p>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-light rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Enrollment</p>
                <p className="text-lg font-bold text-white">{school.enrollment ?? "N/A"}</p>
                {school.capacity && (
                  <p className="text-[10px] text-text-muted mt-0.5">of {school.capacity} capacity</p>
                )}
              </div>
              <div className="glass-light rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Class Size</p>
                <p className="text-lg font-bold text-white">{school.classSize ?? "N/A"}</p>
                <p className="text-[10px] text-text-muted mt-0.5">avg students/class</p>
              </div>
              <div className="glass-light rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">FSA Score</p>
                <p className="text-lg font-bold" style={{ color: (school.fsaOverall ?? 0) >= 80 ? "#34d399" : (school.fsaOverall ?? 0) >= 65 ? "#fbbf24" : "#f87171" }}>
                  {school.fsaOverall ?? "N/A"}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">out of 100</p>
              </div>
              <div className="glass-light rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Rating</p>
                <p className="text-lg font-bold text-warning">{school.rating?.toFixed(1) ?? "N/A"}</p>
                <p className="text-[10px] text-text-muted mt-0.5">out of 10</p>
              </div>
            </div>

            {/* FSA Breakdown */}
            {(school.fsaReading || school.fsaWriting || school.fsaNumeracy) && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)]">
                  Foundation Skills Assessment
                </h3>
                {school.fsaReading && (
                  <StatBar label="Reading" value={school.fsaReading} max={100} color="#3b82f6" />
                )}
                {school.fsaWriting && (
                  <StatBar label="Writing" value={school.fsaWriting} max={100} color="#8b5cf6" />
                )}
                {school.fsaNumeracy && (
                  <StatBar label="Numeracy" value={school.fsaNumeracy} max={100} color="#34d399" />
                )}
              </div>
            )}

            {/* AI Analysis */}
            {analysis && (
              <>
                {/* Strengths */}
                <div>
                  <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                        <p className="text-xs text-text-secondary leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Considerations */}
                <div>
                  <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">
                    Things to Consider
                  </h3>
                  <div className="space-y-2">
                    {analysis.considerations.map((c, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                        <p className="text-xs text-text-secondary leading-relaxed">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neighborhood */}
                <div className="glass-light rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">
                    Neighborhood
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{analysis.neighborhoodVibe}</p>
                </div>

                {/* Transit */}
                <div className="glass-light rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">
                    Transit & Access
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{analysis.transitAccessibility}</p>
                </div>

                {/* Best For */}
                <div>
                  <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">
                    Best For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.bestFor.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-3 py-1.5 rounded-full font-medium"
                        style={{ background: `${accentColor}15`, color: accentColor }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nearby Highlights */}
                {analysis.nearbyHighlights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">
                      Nearby Highlights
                    </h3>
                    <div className="space-y-1.5">
                      {analysis.nearbyHighlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <svg className="w-3 h-3 mt-0.5 text-accent-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-xs text-text-secondary">{h}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Tags */}
            {school.tags && school.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {school.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
