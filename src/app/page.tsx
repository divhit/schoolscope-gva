"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { APIProvider } from "@vis.gl/react-google-maps";
import { SchoolMap } from "@/components/SchoolMap";
import { MapErrorBoundary } from "@/components/MapErrorBoundary";
import { SearchBar } from "@/components/SearchBar";
import { SchoolCard } from "@/components/SchoolCard";
import { SchoolDetail } from "@/components/SchoolDetail";
import { SearchStatus } from "@/components/SearchStatus";
import { StatsOverview } from "@/components/StatsOverview";
import { FilterPanel } from "@/components/FilterPanel";
import { getAllSchools, getSchoolsNear } from "@/lib/schools-data";
import type { School, SchoolAnalysis, AppState, SearchInterpretation } from "@/lib/types";

interface SchoolAnalysisData {
  analysis: SchoolAnalysis;
  photoUri?: string;
  nearbyInfo?: string;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, SchoolAnalysisData>>({});
  const [interpretation, setInterpretation] = useState<SearchInterpretation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [analyzedCount, setAnalyzedCount] = useState(0);
  const [showMap, setShowMap] = useState(true);
  const [filteredSchools, setFilteredSchools] = useState<School[] | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const getUserLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      if (userLocation) {
        resolve(userLocation);
        return;
      }
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserLocation(loc);
            resolve(loc);
          },
          () => {
            // Default to Vancouver center
            const loc = { lat: 49.2827, lng: -123.1207 };
            setUserLocation(loc);
            resolve(loc);
          }
        );
      } else {
        const loc = { lat: 49.2827, lng: -123.1207 };
        setUserLocation(loc);
        resolve(loc);
      }
    });
  }, [userLocation]);

  const handleSearch = useCallback(
    async (query: string) => {
      // Cancel previous search
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setAppState("interpreting");
      setSchools([]);
      setAnalyses({});
      setSelectedSchool(null);
      setAnalyzedCount(0);
      setInterpretation(null);
      setFilteredSchools(null);

      const location = await getUserLocation();

      // Safety timeout: if search takes > 45s, show whatever we have
      const safetyTimeout = setTimeout(() => {
        setAppState((prev) => prev !== "idle" && prev !== "results" ? "results" : prev);
      }, 45000);

      try {
        const response = await fetch("/api/schools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            latitude: location.lat,
            longitude: location.lng,
            radius: 25000,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) throw new Error("Search failed");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          let eventType = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7);
            } else if (line.startsWith("data: ") && eventType) {
              try {
                const data = JSON.parse(line.slice(6));

                switch (eventType) {
                  case "interpreting": {
                    const interp = data as SearchInterpretation;
                    setInterpretation(interp);
                    setAppState("searching");
                    // Zoom map to the identified neighborhood
                    const hoodCenters: Record<string, { lat: number; lng: number }> = {
                      kitsilano: { lat: 49.2685, lng: -123.1680 },
                      kits: { lat: 49.2685, lng: -123.1680 },
                      kerrisdale: { lat: 49.2330, lng: -123.1570 },
                      dunbar: { lat: 49.2500, lng: -123.1880 },
                      fairview: { lat: 49.2630, lng: -123.1300 },
                      "mount pleasant": { lat: 49.2620, lng: -123.1000 },
                      "commercial drive": { lat: 49.2700, lng: -123.0700 },
                      shaughnessy: { lat: 49.2440, lng: -123.1510 },
                      oakridge: { lat: 49.2260, lng: -123.1160 },
                      marpole: { lat: 49.2110, lng: -123.1290 },
                      killarney: { lat: 49.2200, lng: -123.0430 },
                      ubc: { lat: 49.2606, lng: -123.2460 },
                      vancouver: { lat: 49.2500, lng: -123.1200 },
                      burnaby: { lat: 49.2488, lng: -123.0016 },
                      richmond: { lat: 49.1666, lng: -123.1336 },
                      surrey: { lat: 49.1044, lng: -122.8251 },
                      coquitlam: { lat: 49.2838, lng: -122.7932 },
                      "north vancouver": { lat: 49.3200, lng: -123.0700 },
                      "west vancouver": { lat: 49.3400, lng: -123.1700 },
                      "new westminster": { lat: 49.2069, lng: -122.9110 },
                      delta: { lat: 49.0847, lng: -123.0587 },
                      langley: { lat: 49.1044, lng: -122.6600 },
                      "maple ridge": { lat: 49.2193, lng: -122.5984 },
                    };
                    for (const hood of interp.neighborhoods) {
                      const center = hoodCenters[hood.toLowerCase()];
                      if (center) {
                        setUserLocation(center);
                        break;
                      }
                    }
                    break;
                  }

                  case "searching":
                    setSchools(data as School[]);
                    setAppState("analyzing");
                    break;

                  case "analyzing": {
                    const update = data as {
                      schoolId: string;
                      analysis: SchoolAnalysis;
                      photoUri?: string;
                      nearbyInfo?: string;
                    };
                    setAnalyses((prev) => ({
                      ...prev,
                      [update.schoolId]: {
                        analysis: update.analysis,
                        photoUri: update.photoUri ?? undefined,
                        nearbyInfo: update.nearbyInfo,
                      },
                    }));
                    setAnalyzedCount((c) => c + 1);
                    break;
                  }

                  case "complete":
                    setAppState("results");
                    break;

                  case "error":
                    console.error("Search error:", data);
                    setAppState("results");
                    break;
                }
              } catch {
                // Skip malformed JSON
              }
              eventType = "";
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Search failed:", err);
        setAppState("results");
      } finally {
        clearTimeout(safetyTimeout);
      }
    },
    [getUserLocation]
  );

  // Browse mode: load all nearby schools without AI
  const handleBrowse = useCallback(async (address?: string) => {
    setAppState("searching");
    setSchools([]);
    setAnalyses({});
    setSelectedSchool(null);
    setFilteredSchools(null);
    setInterpretation(null);

    let lat: number, lng: number;

    if (address) {
      // Geocode the address using Google Maps
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ", Greater Vancouver, BC")}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.results?.[0]) {
          lat = data.results[0].geometry.location.lat;
          lng = data.results[0].geometry.location.lng;
          setUserLocation({ lat, lng });
        } else {
          const loc = await getUserLocation();
          lat = loc.lat;
          lng = loc.lng;
        }
      } catch {
        const loc = await getUserLocation();
        lat = loc.lat;
        lng = loc.lng;
      }
    } else {
      const loc = await getUserLocation();
      lat = loc.lat;
      lng = loc.lng;
    }

    // Load schools within 2km of the address (tight radius for relevance)
    let nearby = getSchoolsNear(lat, lng, 2);
    if (nearby.length < 5) nearby = getSchoolsNear(lat, lng, 3);
    if (nearby.length < 3) nearby = getSchoolsNear(lat, lng, 5);
    setSchools(nearby.slice(0, 20));
    setInterpretation({
      searchTerms: [],
      schoolTypes: [],
      priorities: [],
      neighborhoods: [],
      summary: address ? `Schools near ${address}` : "Schools near your location",
      accentColor: "#3B82F6",
    });
    setAppState("results");
  }, [getUserLocation]);

  const isSearching = appState !== "idle" && appState !== "results";
  const accentColor = interpretation?.accentColor;

  // Load more schools when user pans the map (only in browse/results mode)
  const handleMapMove = useCallback((center: { lat: number; lng: number }) => {
    if (appState !== "results" || !interpretation) return;
    // Only reload if this was a browse (address) search, not AI search
    if (interpretation.searchTerms.length > 0) return;
    const nearby = getSchoolsNear(center.lat, center.lng, 2);
    if (nearby.length < 3) return;
    // Merge with existing schools, deduplicate
    setSchools((prev) => {
      const ids = new Set(prev.map((s) => s.id));
      const newSchools = nearby.filter((s) => !ids.has(s.id));
      if (newSchools.length === 0) return prev;
      return [...prev, ...newSchools].slice(0, 40);
    });
  }, [appState, interpretation]);

  // Sort schools by analysis score if available
  const displaySchools = filteredSchools ?? schools;
  const sortedSchools = [...displaySchools].sort((a, b) => {
    const scoreA = analyses[a.id]?.analysis.overallScore ?? 0;
    const scoreB = analyses[b.id]?.analysis.overallScore ?? 0;
    return scoreB - scoreA;
  });

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="relative z-40 shrink-0 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)]">
          <div className="px-4 md:px-6 py-3 flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--accent)" }}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-semibold text-[var(--text)]">
                  SchoolScope
                </h1>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)] -mt-0.5 font-medium">
                  Greater Vancouver
                </p>
              </div>
            </div>

            {/* Search bar - centered */}
            <div className="flex-1 flex justify-center">
              <SearchBar
                onSearch={handleSearch}
                onBrowse={handleBrowse}
                isSearching={isSearching}
                accentColor={accentColor}
              />
            </div>

            {/* Filter panel */}
            {appState !== "idle" && schools.length > 0 && (
              <FilterPanel
                schools={schools}
                onFilter={(filtered) => setFilteredSchools(filtered.length === schools.length ? null : filtered)}
                accentColor={accentColor}
              />
            )}

            {/* View toggle */}
            <div className="shrink-0 flex items-center gap-0.5 bg-[var(--surface-2)] rounded-xl p-1">
              <button
                onClick={() => setShowMap(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showMap ? "bg-[var(--surface-3)] text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setShowMap(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !showMap ? "bg-[var(--surface-3)] text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Map / Idle hero */}
          <div className={`relative transition-all duration-500 ${
            appState === "idle"
              ? "w-full"
              : showMap
              ? "w-full md:w-[60%]"
              : "hidden md:block md:w-0"
          }`}>
            {appState === "idle" ? (
              /* Idle state — hero */
              <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 text-center max-w-2xl"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-4"
                  >
                    Greater Vancouver &middot; 619 Schools &middot; 11 Districts
                  </motion.p>

                  <h2 className="text-4xl md:text-[52px] leading-[1.1] font-semibold text-[var(--text)] mb-5">
                    Find the right school<br />for your family
                  </h2>
                  <p className="text-base text-[var(--text-secondary)] mb-10 leading-relaxed max-w-lg mx-auto">
                    Search naturally. We analyze academics, enrollment, facilities,
                    programs, and neighborhood for every school in the Greater Vancouver Area.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {[
                      "Real BC Gov Data",
                      "AI Analysis",
                      "22-Year History",
                      "IB & AP Programs",
                      "FCI & Seismic",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-10 w-full max-w-2xl"
                >
                  <StatsOverview />
                </motion.div>
              </div>
            ) : (
              /* Map view */
              <div className="h-full p-2">
                <MapErrorBoundary>
                  <SchoolMap
                    schools={schools}
                    selectedSchool={selectedSchool}
                    onSelectSchool={setSelectedSchool}
                    userLocation={userLocation}
                    accentColor={accentColor}
                    onMapMove={handleMapMove}
                  />
                </MapErrorBoundary>
              </div>
            )}
          </div>

          {/* Results sidebar */}
          <AnimatePresence>
            {appState !== "idle" && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: showMap ? "40%" : "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] hidden md:block"
              >
                <div className="p-4 space-y-4">
                  {/* Interpretation header */}
                  {interpretation && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]"
                    >
                      <p className="text-sm text-[var(--text)] font-medium">{interpretation.summary}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {interpretation.priorities.slice(0, 4).map((p, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: `${accentColor ?? "var(--accent)"}15`,
                              color: accentColor ?? "var(--accent)",
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Status */}
                  <SearchStatus
                    state={appState}
                    accentColor={accentColor}
                    analyzedCount={analyzedCount}
                    totalCount={Math.min(schools.length, 9)}
                  />

                  {/* Results count */}
                  {schools.length > 0 && (
                    <p className="text-xs text-text-muted">
                      {sortedSchools.length}{filteredSchools ? ` of ${schools.length}` : ""} schools found
                      {Object.keys(analyses).length > 0 && (
                        <span> · {Object.keys(analyses).length} analyzed</span>
                      )}
                    </p>
                  )}

                  {/* School cards grid */}
                  <div className={`grid gap-3 ${showMap ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
                    {sortedSchools.map((school, i) => (
                      <SchoolCard
                        key={school.id}
                        school={school}
                        analysis={analyses[school.id]?.analysis}
                        photoUri={analyses[school.id]?.photoUri}
                        index={i}
                        isSelected={selectedSchool?.id === school.id}
                        onClick={() => setSelectedSchool(school)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile results */}
          {appState !== "idle" && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 max-h-[50vh] overflow-y-auto bg-[var(--surface)] border-t border-[var(--border)] rounded-t-2xl">
              <div className="p-4 space-y-3">
                <div className="w-10 h-1 rounded-full bg-[var(--border)] mx-auto mb-2" />

                <SearchStatus
                  state={appState}
                  accentColor={accentColor}
                  analyzedCount={analyzedCount}
                  totalCount={Math.min(schools.length, 9)}
                />

                {sortedSchools.map((school, i) => (
                  <SchoolCard
                    key={school.id}
                    school={school}
                    analysis={analyses[school.id]?.analysis}
                    photoUri={analyses[school.id]?.photoUri}
                    index={i}
                    isSelected={selectedSchool?.id === school.id}
                    onClick={() => setSelectedSchool(school)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Detail panel */}
        <SchoolDetail
          school={selectedSchool}
          analysis={selectedSchool ? analyses[selectedSchool.id]?.analysis : undefined}
          photoUri={selectedSchool ? analyses[selectedSchool.id]?.photoUri : undefined}
          onClose={() => setSelectedSchool(null)}
        />
      </div>
    </APIProvider>
  );
}
