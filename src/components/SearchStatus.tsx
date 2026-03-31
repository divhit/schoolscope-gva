"use client";

import { motion } from "framer-motion";
import type { AppState } from "@/lib/types";

interface SearchStatusProps {
  state: AppState;
  accentColor?: string;
  analyzedCount: number;
  totalCount: number;
}

const PHASE_TEXT: Record<AppState, string> = {
  idle: "",
  interpreting: "Understanding your requirements...",
  searching: "Finding matching schools across Greater Vancouver...",
  analyzing: "AI is analyzing each school for you...",
  results: "Discovery complete",
};

export function SearchStatus({ state, accentColor, analyzedCount, totalCount }: SearchStatusProps) {
  if (state === "idle" || state === "results") return null;

  const color = accentColor ?? "var(--accent)";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 px-4 py-3 bg-[var(--surface)] rounded-xl border border-[var(--border)]"
    >
      {/* Animated orb */}
      <div className="relative w-8 h-8 shrink-0">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `${color}33` }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full"
          style={{ background: `${color}66` }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{ background: color }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium">{PHASE_TEXT[state]}</p>
        {state === "analyzing" && totalCount > 0 && (
          <div className="mt-1.5">
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>Analyzing schools</span>
              <span>{analyzedCount} / {totalCount}</span>
            </div>
            <div className="stat-bar">
              <motion.div
                className="stat-bar-fill"
                style={{ background: `linear-gradient(90deg, ${color}, var(--accent-2))` }}
                initial={{ width: 0 }}
                animate={{ width: `${(analyzedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
