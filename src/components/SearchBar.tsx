"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onBrowse?: (address?: string) => void;
  isSearching: boolean;
  accentColor?: string;
}

const SUGGESTIONS = [
  { text: "Elementary schools in Kitsilano", type: "search" as const },
  { text: "French Immersion schools in Vancouver", type: "search" as const },
  { text: "IB program schools in Vancouver", type: "search" as const },
  { text: "Secondary schools in North Vancouver", type: "search" as const },
  { text: "Schools near Commercial Drive", type: "search" as const },
  { text: "Public schools in Richmond", type: "search" as const },
];

const ADDRESS_EXAMPLES = [
  "2200 W 4th Ave, Vancouver",
  "4500 Oak St, Vancouver",
  "1100 Lonsdale Ave, North Vancouver",
];

export function SearchBar({ onSearch, onBrowse, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mode, setMode] = useState<"search" | "address">("search");
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (places && !autocompleteService.current) {
      autocompleteService.current = new places.AutocompleteService();
    }
  }, [places]);

  const fetchPredictions = useCallback((input: string) => {
    if (!autocompleteService.current || input.length < 3 || mode !== "address") {
      setPredictions([]);
      return;
    }
    autocompleteService.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: "ca" },
        locationBias: { lat: 49.25, lng: -123.1, radius: 50000 } as unknown as google.maps.LatLng,
        types: ["address"],
      },
      (results) => {
        setPredictions(results?.slice(0, 5) ?? []);
      }
    );
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    setShowSuggestions(false);
    if (mode === "address" && onBrowse) {
      onBrowse(query.trim());
    } else {
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (text: string, type: "search" | "address") => {
    setQuery(text);
    setShowSuggestions(false);
    if (type === "address" && onBrowse) {
      onBrowse(text);
    } else {
      onSearch(text);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative bg-[var(--surface)] rounded-2xl border border-[var(--border)] hover:border-[var(--border-light)] transition-all duration-300 overflow-hidden">
          {/* Mode tabs */}
          <div className="flex border-b border-[var(--border)]">
            <button
              type="button"
              onClick={() => { setMode("search"); setQuery(""); }}
              className={`flex-1 px-4 py-2 text-[11px] font-medium transition-colors ${
                mode === "search" ? "text-[var(--accent)] border-b-2 border-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              AI Search
            </button>
            <button
              type="button"
              onClick={() => { setMode("address"); setQuery(""); }}
              className={`flex-1 px-4 py-2 text-[11px] font-medium transition-colors ${
                mode === "address" ? "text-[var(--accent)] border-b-2 border-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Find by Address
            </button>
          </div>

          <div className="flex items-center gap-3 px-5 py-3">
            <svg className="w-[16px] h-[16px] shrink-0 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mode === "search" ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              )}
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (mode === "address") fetchPredictions(e.target.value); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={mode === "search" ? "What kind of school are you looking for?" : "Enter your address to find nearby schools"}
              className="flex-1 bg-transparent text-[var(--text)] text-[14px] placeholder:text-[var(--text-muted)] focus:outline-none"
              disabled={isSearching}
            />

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 disabled:opacity-30 hover:opacity-90 active:scale-[0.97]"
              style={{ background: "var(--accent)" }}
            >
              {isSearching ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Wait
                </span>
              ) : mode === "search" ? "Search" : "Find"}
            </button>
          </div>

          {isSearching && (
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] rounded-full"
              style={{ background: "var(--accent)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 15, ease: "easeInOut" }}
            />
          )}
        </div>
      </form>

      {/* Browse nearby button */}
      {onBrowse && !isSearching && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => onBrowse()}
            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Or browse schools near my current location
          </button>
        </div>
      )}

      <AnimatePresence>
        {showSuggestions && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-lg overflow-hidden z-50"
          >
            <div className="p-2">
              {mode === "search" ? (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-2 font-medium">
                    Try searching for
                  </p>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s.text, s.type)}
                      className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
                    >
                      {s.text}
                    </button>
                  ))}
                </>
              ) : predictions.length > 0 ? (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-2 font-medium">
                    Suggestions
                  </p>
                  {predictions.map((p) => (
                    <button
                      key={p.place_id}
                      onClick={() => {
                        setQuery(p.description);
                        setPredictions([]);
                        setShowSuggestions(false);
                        if (onBrowse) onBrowse(p.description);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors flex items-start gap-2"
                    >
                      <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="truncate">{p.description}</span>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-2 font-medium">
                    Enter your address to find nearby schools
                  </p>
                  {ADDRESS_EXAMPLES.map((addr, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(addr, "address")}
                      className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
                    >
                      {addr}
                    </button>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
