"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  accentColor?: string;
}

const SUGGESTIONS = [
  "Elementary schools in Kitsilano",
  "French Immersion schools in Vancouver",
  "IB program schools in Vancouver",
  "Schools with available seats in Burnaby",
  "High-performing elementary schools in Kerrisdale",
  "Secondary schools in North Vancouver",
  "Schools near Commercial Drive",
  "Public schools in Richmond with small class sizes",
];

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
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
        <div className="relative bg-white rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <svg className="w-[18px] h-[18px] shrink-0 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              className="flex-1 bg-transparent text-[var(--text)] text-[15px] placeholder:text-[var(--text-muted)] focus:outline-none"
              disabled={isSearching}
            />

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="shrink-0 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 hover:opacity-90 active:scale-[0.97]"
              style={{ background: "var(--accent)" }}
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching
                </span>
              ) : (
                "Discover"
              )}
            </button>
          </div>

          {isSearching && (
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] rounded-full"
              style={{ background: "var(--accent)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "easeInOut" }}
            />
          )}
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[var(--border)] shadow-lg overflow-hidden z-50"
          >
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-2 font-semibold">
                Try searching for
              </p>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
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
