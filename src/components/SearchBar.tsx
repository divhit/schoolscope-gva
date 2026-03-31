"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onBrowse?: (address?: string, latLng?: { lat: number; lng: number }) => void;
  isSearching: boolean;
  accentColor?: string;
}

const SUGGESTIONS = [
  "Elementary schools in Kitsilano",
  "French Immersion schools in Vancouver",
  "IB program schools in Vancouver",
  "Secondary schools in North Vancouver",
  "Schools near Commercial Drive",
  "Public schools in Richmond",
];

export function SearchBar({ onSearch, onBrowse, isSearching }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const places = useMapsLibrary("places");
  const geocodingLib = useMapsLibrary("geocoding");

  useEffect(() => {
    if (places && !autocompleteService.current) {
      autocompleteService.current = new places.AutocompleteService();
    }
  }, [places]);

  useEffect(() => {
    if (geocodingLib && !geocoderRef.current) {
      geocoderRef.current = new geocodingLib.Geocoder();
    }
  }, [geocodingLib]);

  // Detect if input looks like an address (starts with number or contains street words)
  const looksLikeAddress = useCallback((input: string) => {
    return /^\d/.test(input.trim()) || /\b(st|ave|blvd|dr|rd|way|cres|pl|ct)\b/i.test(input);
  }, []);

  const fetchPredictions = useCallback((input: string) => {
    if (!autocompleteService.current || input.length < 4 || !looksLikeAddress(input)) {
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
      (results) => setPredictions(results?.slice(0, 5) ?? [])
    );
  }, [looksLikeAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    setShowDropdown(false);
    setPredictions([]);
    if (looksLikeAddress(query) && onBrowse) {
      onBrowse(query.trim());
    } else {
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-light)] transition-all overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <svg className="w-4 h-4 shrink-0 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); fetchPredictions(e.target.value); }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search schools or enter an address..."
              className="flex-1 bg-transparent text-[var(--text)] text-[14px] placeholder:text-[var(--text-muted)] focus:outline-none min-w-0"
              disabled={isSearching}
            />

            <button type="submit" disabled={isSearching || !query.trim()}
              className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-30 hover:opacity-90 active:scale-[0.97] transition-all"
              style={{ background: "var(--accent)" }}>
              {isSearching ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> : "Go"}
            </button>
          </div>

          {isSearching && (
            <motion.div className="absolute bottom-0 left-0 h-[2px] rounded-full" style={{ background: "var(--accent)" }}
              initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 15, ease: "easeInOut" }} />
          )}
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && !isSearching && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-xl overflow-hidden z-50">
            <div className="p-1.5">
              {predictions.length > 0 ? (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-1.5 font-medium">Addresses</p>
                  {predictions.map((p) => (
                    <button key={p.place_id}
                      onClick={() => {
                        setQuery(p.description); setPredictions([]); setShowDropdown(false);
                        // Geocode to get lat/lng from place_id
                        if (geocoderRef.current && onBrowse) {
                          geocoderRef.current.geocode({ placeId: p.place_id }, (results, status) => {
                            if (status === "OK" && results?.[0]) {
                              const loc = results[0].geometry.location;
                              onBrowse(p.description, { lat: loc.lat(), lng: loc.lng() });
                            } else {
                              onBrowse(p.description);
                            }
                          });
                        } else if (onBrowse) { onBrowse(p.description); }
                      }}
                      className="w-full text-left px-3 py-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="truncate">{p.description}</span>
                    </button>
                  ))}
                </>
              ) : (
                SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => { setQuery(s); setShowDropdown(false); onSearch(s); }}
                    className="w-full text-left px-3 py-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors">
                    {s}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
