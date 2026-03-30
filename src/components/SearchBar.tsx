"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  accentColor?: string;
}

const SUGGESTIONS = [
  "Best elementary schools near Kitsilano",
  "French immersion schools in Vancouver",
  "Top-rated private schools on the North Shore",
  "IB program secondary schools near transit",
  "Small class sizes in West Vancouver",
  "High-performing public schools in Kerrisdale",
  "Arts-focused schools for creative kids",
  "Schools with strong academics near UBC",
];

export function SearchBar({ onSearch, isSearching, accentColor }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div
          className="relative glass rounded-2xl overflow-hidden transition-shadow duration-300"
          style={{
            boxShadow: showSuggestions
              ? `0 0 40px ${accentColor ?? "var(--accent)"}15`
              : "none",
          }}
        >
          <div className="flex items-center gap-3 px-5 py-4">
            {/* Search icon */}
            <svg
              className="w-5 h-5 shrink-0"
              style={{ color: accentColor ?? "var(--accent)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="What kind of school are you looking for?"
              className="flex-1 bg-transparent text-white text-base placeholder:text-text-muted focus:outline-none"
              disabled={isSearching}
            />

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-40"
              style={{
                background: `linear-gradient(135deg, ${accentColor ?? "var(--accent)"}, var(--accent-2))`,
                color: "white",
              }}
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching
                </span>
              ) : (
                "Discover"
              )}
            </button>
          </div>

          {/* Loading bar */}
          {isSearching && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 rounded-full"
              style={{ background: `linear-gradient(90deg, ${accentColor ?? "var(--accent)"}, var(--accent-2))` }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, ease: "easeInOut" }}
            />
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-50"
          >
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-text-muted px-3 py-2 font-semibold">
                Try searching for
              </p>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-3 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
