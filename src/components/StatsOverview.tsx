"use client";

import { motion } from "framer-motion";
import { getDistrictStats, getTopSchools, getAllSchools } from "@/lib/schools-data";

export function StatsOverview() {
  const stats = getDistrictStats();
  const topSchools = getTopSchools(5);
  const allSchools = getAllSchools();

  const totalStudents = allSchools.reduce((s, school) => s + (school.enrollment ?? 0), 0);
  const withFSA = allSchools.filter((s) => s.fsaOverall);
  const avgFSA = withFSA.length > 0
    ? Math.round(withFSA.reduce((sum, s) => sum + (s.fsaOverall ?? 0), 0) / withFSA.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Schools", value: allSchools.length.toString(), color: "var(--accent)" },
          { label: "Students", value: `${(totalStudents / 1000).toFixed(0)}K`, color: "var(--accent-light)" },
          { label: "Districts", value: stats.length.toString(), color: "var(--text)" },
          { label: "Avg FSA", value: avgFSA.toString(), color: "var(--warning)" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-[var(--surface)] rounded-xl p-4 text-center border border-[var(--border)]"
          >
            <p className="text-2xl font-bold font-semibold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-1 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Top Schools */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text)] font-semibold mb-3">
          Top Rated Schools
        </h3>
        <div className="space-y-2">
          {topSchools.map((school, i) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-3 bg-[var(--surface)] rounded-xl px-4 py-3 border border-[var(--border)]"
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: i === 0 ? "#FEF3C7" : i === 1 ? "#F1F5F9" : i === 2 ? "#FDE8D8" : "var(--surface-2)",
                  color: i === 0 ? "#92400E" : i === 1 ? "#475569" : i === 2 ? "#9A3412" : "var(--text-muted)",
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text)] font-medium truncate">{school.name}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{school.district} &middot; {school.category}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{school.fsaOverall}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* District breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text)] font-semibold mb-3">
          By District
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {stats.sort((a, b) => b.totalSchools - a.totalSchools).map((d, i) => (
            <motion.div
              key={d.district}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.03 }}
              className="bg-[var(--surface)] rounded-xl px-3 py-2.5 border border-[var(--border)]"
            >
              <p className="text-xs font-medium text-[var(--text)]">{d.district}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[var(--text-muted)]">{d.totalSchools} schools</span>
                <span className="text-[10px] font-semibold" style={{ color: "var(--accent)" }}>FSA {d.avgFSA}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
