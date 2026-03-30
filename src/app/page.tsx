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

      const location = await getUserLocation();

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
                  case "interpreting":
                    setInterpretation(data as SearchInterpretation);
                    setAppState("searching");
                    break;

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
        setAppState("idle");
      }
    },
    [getUserLocation]
  );

  const isSearching = appState !== "idle" && appState !== "results";
  const accentColor = interpretation?.accentColor;

  // Sort schools by analysis score if available
  const sortedSchools = [...schools].sort((a, b) => {
    const scoreA = analyses[a.id]?.analysis.overallScore ?? 0;
    const scoreB = analyses[b.id]?.analysis.overallScore ?? 0;
    return scoreB - scoreA;
  });

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="relative z-40 shrink-0">
          <div className="px-4 md:px-6 py-4 flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold font-[family-name:var(--font-space-grotesk)] gradient-text">
                  SchoolScope
                </h1>
                <p className="text-[9px] uppercase tracking-widest text-text-muted -mt-0.5">
                  Greater Vancouver
                </p>
              </div>
            </div>

            {/* Search bar - centered */}
            <div className="flex-1 flex justify-center">
              <SearchBar
                onSearch={handleSearch}
                isSearching={isSearching}
                accentColor={accentColor}
              />
            </div>

            {/* View toggle */}
            <div className="shrink-0 flex items-center gap-1 glass rounded-xl p-1">
              <button
                onClick={() => setShowMap(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  showMap ? "bg-white/10 text-white" : "text-text-muted hover:text-white"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setShowMap(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !showMap ? "bg-white/10 text-white" : "text-text-muted hover:text-white"
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
                {/* Background gradient orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
                  <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent-2/5 blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[100px]" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 text-center max-w-2xl"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center shadow-lg shadow-accent/20"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </motion.div>

                  <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] gradient-text mb-4">
                    Find the Perfect School
                  </h2>
                  <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                    AI-powered school discovery for{" "}
                    <span className="text-white font-medium">Greater Vancouver</span>.
                    Search naturally — we analyze academics, neighborhood, transit access,
                    and nearby amenities for every school.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {[
                      "60+ Schools",
                      "BC FSA Data",
                      "AI Analysis",
                      "Google Maps",
                      "Transit Scores",
                      "10 Districts",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full glass text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Stats */}
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
                className="h-full overflow-y-auto border-l border-white/5 bg-background hidden md:block"
              >
                <div className="p-4 space-y-4">
                  {/* Interpretation header */}
                  {interpretation && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-xl p-4"
                    >
                      <p className="text-sm text-white font-medium">{interpretation.summary}</p>
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
                      {sortedSchools.length} schools found
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
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 max-h-[50vh] overflow-y-auto bg-background border-t border-white/5 rounded-t-2xl">
              <div className="p-4 space-y-3">
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-2" />

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
