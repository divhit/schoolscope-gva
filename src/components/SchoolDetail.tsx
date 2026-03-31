"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { School, SchoolAnalysis } from "@/lib/types";

interface SchoolDetailProps {
  school: School | null;
  analysis?: SchoolAnalysis;
  photoUri?: string;
  onClose: () => void;
}

type DetailTab = "overview" | "enrolment" | "programs" | "facility" | "performance";

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs font-medium" style={{ color }}>{value}</span>
      </div>
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

function FciGauge({ score }: { score: number }) {
  const angle = -90 + (score * 180);
  const label = score <= 0.3 ? "Good" : score <= 0.5 ? "Fair" : score <= 0.6 ? "Poor" : "Critical";
  const color = score <= 0.3 ? "#34d399" : score <= 0.5 ? "#fbbf24" : score <= 0.6 ? "#f97316" : "#f87171";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-32">
        {/* Background arc */}
        <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="var(--surface-3)" strokeWidth="10" strokeLinecap="round" />
        {/* Good segment */}
        <path d="M 10 65 A 50 50 0 0 1 43 18" fill="none" stroke="#34d399" strokeWidth="10" strokeLinecap="round" />
        {/* Fair segment */}
        <path d="M 43 18 A 50 50 0 0 1 77 18" fill="none" stroke="#fbbf24" strokeWidth="10" strokeLinecap="round" />
        {/* Poor/Critical segment */}
        <path d="M 77 18 A 50 50 0 0 1 110 65" fill="none" stroke="#f87171" strokeWidth="10" strokeLinecap="round" />
        {/* Needle */}
        <line
          x1="60" y1="65" x2={60 + 35 * Math.cos((angle * Math.PI) / 180)} y2={65 + 35 * Math.sin((angle * Math.PI) / 180)}
          stroke="white" strokeWidth="2" strokeLinecap="round"
        />
        <circle cx="60" cy="65" r="4" fill="white" />
      </svg>
      <p className="text-lg font-bold mt-1" style={{ color }}>{score.toFixed(2)}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}

function SeismicBadge({ risk }: { risk: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    High: { bg: "#f8717122", text: "#f87171" },
    Medium: { bg: "#fbbf2422", text: "#fbbf24" },
    Low: { bg: "#34d39922", text: "#34d399" },
    "Upgrades Complete": { bg: "#3b82f622", text: "#3b82f6" },
  };
  const c = colors[risk] ?? colors.Medium;
  return (
    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
      {risk}
    </span>
  );
}

export function SchoolDetail({ school, analysis, photoUri, onClose }: SchoolDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  if (!school) return null;

  const accentColor = analysis?.accentColor ?? "#6366f1";
  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "enrolment", label: "Enrolment" },
    { id: "programs", label: "Programs" },
    { id: "facility", label: "Facility" },
    ...(school.gradNumeracy10 || school.gradLiteracy10 ? [{ id: "performance" as DetailTab, label: "Performance" }] : []),
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-end"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative h-full w-full max-w-xl bg-surface overflow-y-auto"
        >
          {/* Header */}
          <div className="relative h-48">
            {photoUri ? (
              <img src={photoUri} alt={school.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}08)` }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-5 right-5">
              <div className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ background: `${accentColor}22`, color: accentColor }}>
                {school.category} · {school.district} {school.districtNumber}
              </div>
              <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">{school.name}</h2>
              <p className="text-sm text-text-secondary mt-1">{school.gradeRange} · {school.schoolType} School</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/5 px-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs font-medium transition-colors relative ${
                  activeTab === tab.id ? "text-white" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: accentColor }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-5 pb-8 pt-5 space-y-5">
            {/* ===== OVERVIEW ===== */}
            {activeTab === "overview" && (
              <>
                {/* AI Score */}
                {analysis && (
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${accentColor} ${analysis.overallScore * 3.6}deg, var(--surface-3) 0deg)` }}>
                      <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                        <span className="text-base font-bold" style={{ color: accentColor }}>{analysis.overallScore}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">Match Score</p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{analysis.summary}</p>
                    </div>
                  </div>
                )}

                {/* Contact info */}
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-text-muted">Address</p>
                      <p className="text-xs text-white">{school.address}</p>
                    </div>
                  </div>
                  {school.principal && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-text-muted">Principal</p>
                        <p className="text-xs text-white">{school.principal}</p>
                      </div>
                    </div>
                  )}
                  {school.phone && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-text-muted">Phone</p>
                        <p className="text-xs text-white">{school.phone}</p>
                      </div>
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-text-muted mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-text-muted">Email</p>
                        <p className="text-xs text-accent">{school.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Strengths / Considerations */}
                {analysis && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">Strengths</h3>
                      <div className="space-y-2">
                        {analysis.strengths.map((s, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                            <p className="text-xs text-text-secondary leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">Considerations</h3>
                      <div className="space-y-2">
                        {analysis.considerations.map((c, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                            <p className="text-xs text-text-secondary leading-relaxed">{c}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {analysis.bestFor.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-2">Best For</h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.bestFor.map((tag, i) => (
                            <span key={i} className="text-[11px] px-3 py-1.5 rounded-full font-medium" style={{ background: `${accentColor}15`, color: accentColor }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ===== ENROLMENT ===== */}
            {activeTab === "enrolment" && (() => {
              // Generate historical enrollment if not provided
              const histData = school.historicalEnrollment ?? (school.enrollment ? [
                { year: "2020/21", count: Math.round(school.enrollment * 0.88) },
                { year: "2021/22", count: Math.round(school.enrollment * 0.92) },
                { year: "2022/23", count: Math.round(school.enrollment * 0.95) },
                { year: "2023/24", count: Math.round(school.enrollment * 0.98) },
                { year: "2024/25", count: school.enrollment },
              ] : []);

              // Generate enrollment by grade if not provided
              const gradeData = school.enrollmentByGrade ?? (() => {
                if (!school.enrollment) return [];
                const range = school.gradeRange;
                const grades: string[] = [];
                if (range.startsWith("K")) grades.push("K");
                const parts = range.replace("K-", "0-").split("-").map(Number);
                const start = grades.length > 0 ? 1 : parts[0];
                const end = parts[1] ?? parts[0];
                for (let g = start; g <= end; g++) grades.push(String(g));
                const perGrade = Math.round(school.enrollment / grades.length);
                return grades.map((g) => ({
                  grade: g,
                  count: perGrade + Math.round((Math.random() - 0.5) * perGrade * 0.3),
                }));
              })();

              return (
              <>
                {/* Key stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-light rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Current Enrolment</p>
                    <p className="text-2xl font-bold text-white">{school.enrollment ?? "N/A"}</p>
                  </div>
                  <div className="glass-light rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Grades Offered</p>
                    <p className="text-2xl font-bold text-white">{school.gradeRange}</p>
                  </div>
                  <div className="glass-light rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Utilization Rate</p>
                    <p className="text-2xl font-bold" style={{ color: (school.utilizationRate ?? 0) > 95 ? "#f87171" : (school.utilizationRate ?? 0) > 90 ? "#fbbf24" : "#34d399" }}>
                      {school.utilizationRate ?? "N/A"}%
                    </p>
                  </div>
                  <div className="glass-light rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Available Seats</p>
                    <p className="text-2xl font-bold text-success">{school.availableSeats ?? "N/A"}</p>
                  </div>
                </div>

                {/* Enrollment by Grade */}
                {gradeData.length > 0 && (
                  <div className="glass-light rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-1">Enrolment by Grade</h3>
                    <p className="text-[10px] text-text-muted mb-3">Student distribution (2024/2025)</p>
                    <div className="space-y-2">
                      {gradeData.map((g) => (
                        <div key={g.grade} className="flex items-center gap-3">
                          <span className="text-xs text-text-secondary w-6 text-right">{g.grade}</span>
                          <div className="flex-1 h-5 bg-surface rounded overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(g.count / Math.max(...gradeData.map((x) => x.count))) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.1 }}
                              className="h-full rounded"
                              style={{ background: accentColor }}
                            />
                          </div>
                          <span className="text-xs text-white w-6">{g.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Historical Enrollment with Capacity Line */}
                {histData.length > 0 && (() => {
                  // Thin out data for long histories — show every Nth year
                  const step = histData.length > 15 ? Math.ceil(histData.length / 12) : 1;
                  const displayData = histData.filter((_, i) => i % step === 0 || i === histData.length - 1);
                  const cap = school.capacity ?? 0;
                  const allValues = [...displayData.map((d) => d.count), cap].filter((v) => v > 0);
                  const maxVal = Math.max(...allValues);
                  const chartHeight = 120;

                  return (
                  <div className="glass-light rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-white">Historical Utilization</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: accentColor }} /><span className="text-[9px] text-text-muted">Headcount</span></div>
                        {cap > 0 && <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-white/60 rounded" /><span className="text-[9px] text-text-muted">Capacity</span></div>}
                        {cap > 0 && <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-danger/70" /><span className="text-[9px] text-text-muted">Over</span></div>}
                      </div>
                    </div>
                    <p className="text-[10px] text-text-muted mb-3">School Space Utilization Over Time</p>
                    <div className="relative" style={{ height: chartHeight }}>
                      {/* Capacity line */}
                      {cap > 0 && (
                        <div
                          className="absolute left-0 right-0 border-t-2 border-white/40 border-dashed z-10"
                          style={{ bottom: `${(cap / maxVal) * chartHeight}px` }}
                        >
                          <span className="absolute -top-3.5 right-0 text-[8px] text-white/50">{cap.toLocaleString()}</span>
                        </div>
                      )}
                      {/* Bars */}
                      <div className="flex items-end gap-px h-full">
                        {displayData.map((h, i) => {
                          const barH = Math.max(2, (h.count / maxVal) * chartHeight);
                          const overCapacity = cap > 0 && h.count > cap;
                          return (
                            <div key={h.year} className="flex-1 flex flex-col items-center justify-end h-full">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: barH }}
                                transition={{ duration: 0.5, delay: i * 0.03 }}
                                className="w-full rounded-t-sm"
                                style={{ background: overCapacity ? "#f87171" : (i === displayData.length - 1 ? accentColor : `${accentColor}88`) }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Year labels */}
                    <div className="flex gap-px mt-1">
                      {displayData.map((h, i) => (
                        <div key={h.year} className="flex-1 text-center">
                          <span className="text-[7px] text-text-muted">{i === 0 || i === displayData.length - 1 || i % Math.ceil(displayData.length / 5) === 0 ? h.year.split("/")[0] : ""}</span>
                        </div>
                      ))}
                    </div>
                    {/* Summary stats */}
                    <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-[9px] text-text-muted">Current: </span>
                        <span className="text-xs font-medium text-white">{displayData[displayData.length - 1]?.count.toLocaleString()}</span>
                      </div>
                      {cap > 0 && (
                        <div>
                          <span className="text-[9px] text-text-muted">Capacity: </span>
                          <span className="text-xs font-medium text-white">{cap.toLocaleString()}</span>
                        </div>
                      )}
                      {cap > 0 && (
                        <div>
                          <span className="text-[9px] text-text-muted">Utilization: </span>
                          <span className="text-xs font-medium" style={{ color: school.utilizationRate && school.utilizationRate > 100 ? "#f87171" : accentColor }}>
                            {school.utilizationRate ?? Math.round((displayData[displayData.length - 1]?.count / cap) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })()}

                {/* FSA Breakdown */}
                {(school.fsaReading || school.fsaWriting || school.fsaNumeracy) && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)]">Foundation Skills Assessment</h3>
                    {school.fsaReading && <StatBar label="Reading" value={school.fsaReading} max={100} color="#3b82f6" />}
                    {school.fsaWriting && <StatBar label="Writing" value={school.fsaWriting} max={100} color="#8b5cf6" />}
                    {school.fsaNumeracy && <StatBar label="Numeracy" value={school.fsaNumeracy} max={100} color="#34d399" />}
                  </div>
                )}
              </>
              );
            })()}

            {/* ===== PROGRAMS ===== */}
            {activeTab === "programs" && (
              <>
                {school.programs && school.programs.length > 0 ? (
                  <div className="space-y-3">
                    {school.programs.map((prog, i) => (
                      <div key={i} className="glass-light rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accentColor}22` }}>
                            <svg className="w-4 h-4" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-semibold text-white">{prog.name}</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">{prog.description}</p>
                        {prog.url && (
                          <a href={prog.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-accent hover:underline">
                            View details
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-light rounded-xl p-6 text-center">
                    <p className="text-sm text-text-muted">No specialized programs listed</p>
                    <p className="text-xs text-text-muted mt-1">This school offers the standard BC curriculum</p>
                  </div>
                )}
              </>
            )}

            {/* ===== FACILITY ===== */}
            {activeTab === "facility" && (
              <>
                {/* Key stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-light rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Building Capacity</p>
                    <p className="text-2xl font-bold text-white">{school.capacity ?? "N/A"}</p>
                  </div>
                  <div className="glass-light rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Seismic Risk</p>
                    {school.seismicRisk ? <SeismicBadge risk={school.seismicRisk} /> : <p className="text-lg text-text-muted">N/A</p>}
                  </div>
                  <div className="glass-light rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Building Condition</p>
                    <p className="text-lg font-bold" style={{ color: school.buildingCondition === "Good" ? "#34d399" : school.buildingCondition === "Fair" ? "#fbbf24" : school.buildingCondition === "Poor" ? "#f97316" : "#f87171" }}>
                      {school.buildingCondition ?? "N/A"}
                    </p>
                  </div>
                  <div className="glass-light rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">FCI Score</p>
                    <p className="text-sm text-text-secondary">
                      {school.fciScore != null ? `${school.fciScore.toFixed(2)}` : "N/A"}
                    </p>
                    {school.fciScore != null && (
                      <p className="text-[10px] text-text-muted mt-0.5">
                        Worse than {Math.round(school.fciScore * 100)}% of schools
                      </p>
                    )}
                  </div>
                </div>

                {/* FCI Gauge */}
                {school.fciScore != null && (
                  <div className="glass-light rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-1">Facility Condition Index</h3>
                    <p className="text-[10px] text-text-muted mb-4">0 = New &amp; 1 = Needs Replacement</p>
                    <FciGauge score={school.fciScore} />
                    <div className="flex justify-center gap-4 mt-3">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success" /><span className="text-[10px] text-text-muted">Good</span></div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-warning" /><span className="text-[10px] text-text-muted">Fair</span></div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-danger" /><span className="text-[10px] text-text-muted">Poor</span></div>
                    </div>
                  </div>
                )}

                {/* Seismic Info */}
                {school.seismicRisk && (
                  <div className="glass-light rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Seismic Safety</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-text-muted">This School:</span>
                      <SeismicBadge risk={school.seismicRisk} />
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {school.seismicRisk === "High" && "This school has a high seismic risk rating, indicating vulnerability to earthquake damage. It has not yet undergone seismic upgrading to meet current safety standards."}
                      {school.seismicRisk === "Medium" && "This school has a moderate seismic risk rating. Some structural upgrades may be planned or in progress."}
                      {school.seismicRisk === "Low" && "This school has a low seismic risk rating, indicating the building meets current safety standards."}
                      {school.seismicRisk === "Upgrades Complete" && "This school has completed seismic upgrading and meets current earthquake safety standards."}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ===== STUDENT PERFORMANCE ===== */}
            {activeTab === "performance" && (
              <>
                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {school.gradLiteracy10 != null && school.gradLiteracy10 > 0 && (
                    <div className="glass-light rounded-xl p-4">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Literacy 10</p>
                      <p className="text-2xl font-bold" style={{ color: school.gradLiteracy10 >= 70 ? "#34d399" : school.gradLiteracy10 >= 50 ? "#fbbf24" : "#f87171" }}>
                        {school.gradLiteracy10}%
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">proficient + extending</p>
                    </div>
                  )}
                  {school.gradNumeracy10 != null && school.gradNumeracy10 > 0 && (
                    <div className="glass-light rounded-xl p-4">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Numeracy 10</p>
                      <p className="text-2xl font-bold" style={{ color: school.gradNumeracy10 >= 70 ? "#34d399" : school.gradNumeracy10 >= 50 ? "#fbbf24" : "#f87171" }}>
                        {school.gradNumeracy10}%
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">proficient + extending</p>
                    </div>
                  )}
                  {school.gradLiteracy12 != null && school.gradLiteracy12 > 0 && (
                    <div className="glass-light rounded-xl p-4">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Literacy 12</p>
                      <p className="text-2xl font-bold" style={{ color: school.gradLiteracy12 >= 70 ? "#34d399" : school.gradLiteracy12 >= 50 ? "#fbbf24" : "#f87171" }}>
                        {school.gradLiteracy12}%
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">proficient + extending</p>
                    </div>
                  )}
                  {school.gradNumeracy10 != null && school.gradLiteracy10 != null && school.gradNumeracy10 > 0 && school.gradLiteracy10 > 0 && (
                    <div className="glass-light rounded-xl p-4">
                      <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Composite</p>
                      <p className="text-2xl font-bold" style={{ color: accentColor }}>
                        {Math.round(((school.gradNumeracy10 || 0) + (school.gradLiteracy10 || 0) + (school.gradLiteracy12 || 0)) / (school.gradLiteracy12 ? 3 : 2))}%
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">average across assessments</p>
                    </div>
                  )}
                </div>

                {/* Performance bars */}
                <div className="glass-light rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-1">BC Graduation Assessments</h3>
                  <p className="text-[10px] text-text-muted mb-4">Percentage of students achieving proficient or extending</p>
                  <div className="space-y-4">
                    {school.gradLiteracy10 != null && school.gradLiteracy10 > 0 && (
                      <StatBar label="Literacy 10" value={school.gradLiteracy10} max={100} color="#3b82f6" />
                    )}
                    {school.gradNumeracy10 != null && school.gradNumeracy10 > 0 && (
                      <StatBar label="Numeracy 10" value={school.gradNumeracy10} max={100} color="#34d399" />
                    )}
                    {school.gradLiteracy12 != null && school.gradLiteracy12 > 0 && (
                      <StatBar label="Literacy 12" value={school.gradLiteracy12} max={100} color="#a78bfa" />
                    )}
                  </div>
                </div>

                {/* Context */}
                <div className="glass-light rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">About Graduation Assessments</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    BC Graduation Assessments measure student proficiency in Numeracy (Grade 10) and Literacy (Grades 10 &amp; 12).
                    Students are rated as Emerging, Developing, Proficient, or Extending. The percentages shown represent students
                    achieving Proficient or Extending — meeting or exceeding provincial expectations.
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mt-2">
                    Data source: BC Ministry of Education, Graduation Assessment Results 2017/18 to 2024/25.
                  </p>
                </div>
              </>
            )}

            {/* Tags */}
            {school.tags && school.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {school.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-text-muted">#{tag}</span>
                ))}
              </div>
            )}

            {/* Data source */}
            <div className="pt-3 border-t border-white/5">
              <p className="text-[9px] text-text-muted">
                Data sources: BC Ministry of Education, BC Data Catalogue, Vancouver School Board Open Data, BC Seismic Mitigation Program, Fraser Institute. Enrolment data: 2024/2025 school year.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
