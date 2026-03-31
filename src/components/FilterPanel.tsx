"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { School } from "@/lib/types";

interface FilterPanelProps {
  schools: School[];
  onFilter: (filtered: School[]) => void;
  accentColor?: string;
}

const PROGRAM_FILTERS = [
  { key: "french-immersion", label: "French Immersion", icon: "🇫🇷" },
  { key: "ib", label: "IB Programme", icon: "🌍" },
  { key: "ap", label: "Advanced Placement", icon: "📚" },
  { key: "montessori", label: "Montessori", icon: "🧒" },
  { key: "indigenous", label: "Indigenous Focus", icon: "🪶" },
  { key: "mandarin", label: "Mandarin Bilingual", icon: "🇨🇳" },
  { key: "mini-school", label: "Mini School", icon: "⭐" },
  { key: "trades", label: "Trades & Career", icon: "🔧" },
  { key: "fine-arts", label: "Fine Arts", icon: "🎨" },
  { key: "outdoor", label: "Outdoor Education", icon: "🏔️" },
];

const SCHOOL_TYPES = ["Public", "Independent"];
const GRADE_GROUPS = [
  { key: "elementary", label: "Elementary (K-7)" },
  { key: "secondary", label: "Secondary (8-12)" },
  { key: "k12", label: "K-12" },
];

function matchesProgram(school: School, filterKey: string): boolean {
  const progs = school.programs ?? [];
  const tags = school.tags ?? [];
  switch (filterKey) {
    case "french-immersion":
      return progs.some((p) => p.name.toLowerCase().includes("french immersion")) || tags.includes("french-immersion");
    case "ib":
      return progs.some((p) => p.name.toLowerCase().includes("ib") || p.name.toLowerCase().includes("international baccalaureate")) || tags.includes("IB");
    case "ap":
      return progs.some((p) => p.name.toLowerCase().includes("advanced placement") || p.name.toLowerCase().includes("(ap)")) || tags.includes("AP");
    case "montessori":
      return progs.some((p) => p.name.toLowerCase().includes("montessori")) || tags.includes("montessori");
    case "indigenous":
      return progs.some((p) => p.name.toLowerCase().includes("indigenous")) || tags.includes("indigenous-focus");
    case "mandarin":
      return progs.some((p) => p.name.toLowerCase().includes("mandarin"));
    case "mini-school":
      return progs.some((p) => p.name.toLowerCase().includes("mini school")) || tags.includes("mini-school");
    case "trades":
      return progs.some((p) => p.name.toLowerCase().includes("trades") || p.name.toLowerCase().includes("train") || p.name.toLowerCase().includes("career"));
    case "fine-arts":
      return progs.some((p) => p.name.toLowerCase().includes("fine arts") || p.name.toLowerCase().includes("arts"));
    case "outdoor":
      return progs.some((p) => p.name.toLowerCase().includes("outdoor") || p.name.toLowerCase().includes("trek"));
    default:
      return false;
  }
}

export function FilterPanel({ schools, onFilter, accentColor }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(new Set());

  const color = accentColor ?? "var(--accent)";

  const applyFilters = (
    programs: Set<string>,
    types: Set<string>,
    grades: Set<string>
  ) => {
    let filtered = schools;

    // Program filters (OR within programs)
    if (programs.size > 0) {
      filtered = filtered.filter((s) =>
        [...programs].some((p) => matchesProgram(s, p))
      );
    }

    // Type filter (OR within types)
    if (types.size > 0) {
      filtered = filtered.filter((s) => types.has(s.schoolType));
    }

    // Grade filter
    if (grades.size > 0) {
      filtered = filtered.filter((s) => {
        const range = s.gradeRange.toLowerCase();
        if (grades.has("elementary") && (range.includes("k") || range.startsWith("1") || range.startsWith("2") || range.startsWith("3"))) return true;
        if (grades.has("secondary") && (range.includes("8") || range.includes("9") || range.includes("10") || range.includes("11") || range.includes("12"))) return true;
        if (grades.has("k12") && range.includes("k") && range.includes("12")) return true;
        return false;
      });
    }

    onFilter(filtered);
  };

  const toggleProgram = (key: string) => {
    const next = new Set(selectedPrograms);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedPrograms(next);
    applyFilters(next, selectedTypes, selectedGrades);
  };

  const toggleType = (type: string) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setSelectedTypes(next);
    applyFilters(selectedPrograms, next, selectedGrades);
  };

  const toggleGrade = (grade: string) => {
    const next = new Set(selectedGrades);
    if (next.has(grade)) next.delete(grade);
    else next.add(grade);
    setSelectedGrades(next);
    applyFilters(selectedPrograms, selectedTypes, next);
  };

  const clearAll = () => {
    setSelectedPrograms(new Set());
    setSelectedTypes(new Set());
    setSelectedGrades(new Set());
    onFilter(schools);
  };

  const activeCount = selectedPrograms.size + selectedTypes.size + selectedGrades.size;

  // Count how many schools match each program
  const programCounts = PROGRAM_FILTERS.map((pf) => ({
    ...pf,
    count: schools.filter((s) => matchesProgram(s, pf.key)).length,
  }));

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          isOpen || activeCount > 0
            ? "bg-accent/20 text-white"
            : "glass text-text-muted hover:text-white"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: color, color: "white" }}>
            {activeCount}
          </span>
        )}
      </button>

      {/* Filter panel dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-80 glass rounded-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
          >
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white font-semibold">Filter Schools</h3>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="text-[10px] text-accent hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              {/* School Type */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2 font-semibold">School Type</p>
                <div className="flex gap-2">
                  {SCHOOL_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedTypes.has(type)
                          ? "text-white"
                          : "bg-white/5 text-text-secondary hover:bg-white/10"
                      }`}
                      style={selectedTypes.has(type) ? { background: `${color}33`, color } : undefined}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Level */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2 font-semibold">Grade Level</p>
                <div className="flex flex-wrap gap-2">
                  {GRADE_GROUPS.map((g) => (
                    <button
                      key={g.key}
                      onClick={() => toggleGrade(g.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedGrades.has(g.key)
                          ? "text-white"
                          : "bg-white/5 text-text-secondary hover:bg-white/10"
                      }`}
                      style={selectedGrades.has(g.key) ? { background: `${color}33`, color } : undefined}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Programs */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-2 font-semibold">Programs</p>
                <div className="space-y-1">
                  {programCounts.map((pf) => (
                    <button
                      key={pf.key}
                      onClick={() => pf.count > 0 && toggleProgram(pf.key)}
                      disabled={pf.count === 0}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                        selectedPrograms.has(pf.key)
                          ? "text-white"
                          : pf.count > 0
                          ? "text-text-secondary hover:bg-white/5"
                          : "text-text-muted/40 cursor-not-allowed"
                      }`}
                      style={selectedPrograms.has(pf.key) ? { background: `${color}22` } : undefined}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          selectedPrograms.has(pf.key) ? "border-transparent" : "border-white/20"
                        }`}
                        style={selectedPrograms.has(pf.key) ? { background: color } : undefined}
                      >
                        {selectedPrograms.has(pf.key) && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs flex-1">{pf.label}</span>
                      <span className="text-[10px] text-text-muted">{pf.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
