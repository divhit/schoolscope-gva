"use client";

import { motion } from "framer-motion";
import { getDistrictStats, getTopSchools, getAllSchools } from "@/lib/schools-data";

export function StatsOverview() {
  const stats = getDistrictStats();
  const topSchools = getTopSchools(5);
  const allSchools = getAllSchools();

  const totalStudents = allSchools.reduce((s, school) => s + (school.enrollment ?? 0), 0);
  const avgFSA = Math.round(
    allSchools.filter((s) => s.fsaOverall).reduce((sum, s) => sum + (s.fsaOverall ?? 0), 0) /
    allSchools.filter((s) => s.fsaOverall).length
  );

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Schools Tracked", value: allSchools.length.toString(), color: "#6366f1" },
          { label: "Students", value: `${(totalStudents / 1000).toFixed(1)}K`, color: "#34d399" },
          { label: "Districts", value: stats.length.toString(), color: "#a78bfa" },
          { label: "Avg FSA", value: avgFSA.toString(), color: "#fbbf24" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-light rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Top Schools */}
      <div>
        <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-3">
          Top Rated Schools
        </h3>
        <div className="space-y-2">
          {topSchools.map((school, i) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-3 glass-light rounded-xl px-4 py-3"
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: i === 0 ? "#fbbf2422" : i === 1 ? "#94a3b822" : i === 2 ? "#cd7f3222" : "#55556a11",
                  color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "#55556a",
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{school.name}</p>
                <p className="text-[10px] text-text-muted">{school.district} · {school.category}</p>
              </div>
              <span className="text-sm font-bold text-success">{school.fsaOverall}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* District breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)] mb-3">
          By District
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {stats.sort((a, b) => b.totalSchools - a.totalSchools).map((d, i) => (
            <motion.div
              key={d.district}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.03 }}
              className="glass-light rounded-xl px-3 py-2.5"
            >
              <p className="text-xs font-medium text-white">{d.district}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-text-muted">{d.totalSchools} schools</span>
                <span className="text-[10px] text-accent">FSA {d.avgFSA}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
