import { GoogleGenAI } from "@google/genai";
import type { SearchInterpretation, SchoolAnalysis, School } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SEARCH_SCHEMA = {
  type: "object" as const,
  properties: {
    searchTerms: { type: "array" as const, items: { type: "string" as const } },
    schoolTypes: { type: "array" as const, items: { type: "string" as const } },
    priorities: { type: "array" as const, items: { type: "string" as const } },
    neighborhoods: { type: "array" as const, items: { type: "string" as const } },
    summary: { type: "string" as const },
    accentColor: { type: "string" as const },
  },
  required: ["searchTerms", "schoolTypes", "priorities", "neighborhoods", "summary", "accentColor"],
};

const ANALYSIS_SCHEMA = {
  type: "object" as const,
  properties: {
    summary: { type: "string" as const },
    strengths: { type: "array" as const, items: { type: "string" as const } },
    considerations: { type: "array" as const, items: { type: "string" as const } },
    neighborhoodVibe: { type: "string" as const },
    bestFor: { type: "array" as const, items: { type: "string" as const } },
    transitAccessibility: { type: "string" as const },
    nearbyHighlights: { type: "array" as const, items: { type: "string" as const } },
    overallScore: { type: "number" as const },
    accentColor: { type: "string" as const },
  },
  required: ["summary", "strengths", "considerations", "neighborhoodVibe", "bestFor", "transitAccessibility", "nearbyHighlights", "overallScore", "accentColor"],
};

export async function interpretSearch(query: string): Promise<SearchInterpretation> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      systemInstruction: `You are an AI school discovery assistant for Greater Vancouver Area (Metro Vancouver), BC, Canada.
Given a parent's natural language query about finding schools, interpret their needs.

Generate 2-4 specific search terms that would help find matching schools.
Pick schoolTypes from: Elementary, Secondary, K-12, Middle, Alternative, French Immersion, Montessori, Private, Independent.
For priorities, identify what matters most (academics, arts, sports, diversity, small class size, French immersion, IB program, proximity to transit, etc.).
For neighborhoods, identify any specific Vancouver/GVA neighborhoods mentioned or implied (Kitsilano, Kerrisdale, West Vancouver, North Shore, Burnaby, Richmond, etc.).
The accentColor should be a hex color that represents the search mood (blue for academic focus, green for nature/outdoor, warm colors for arts/creative, etc.).
The summary should be a clear 1-2 sentence description of what the parent is looking for.`,
      temperature: 0.6,
      responseMimeType: "application/json",
      responseSchema: SEARCH_SCHEMA,
    },
  });

  return JSON.parse(response.text ?? "{}") as SearchInterpretation;
}

export async function analyzeSchool(
  school: School,
  userQuery: string,
  nearbyInfo: string
): Promise<SchoolAnalysis> {
  const schoolProfile = `
School: ${school.name}
Address: ${school.address}
District: ${school.district}
Category: ${school.category}
Enrollment: ${school.enrollment ?? "Unknown"}
Capacity: ${school.capacity ?? "Unknown"}
FSA Overall: ${school.fsaOverall ?? "Unknown"}/100
Rating: ${school.rating ?? "Unknown"}/10
Average Class Size: ${school.classSize ?? "Unknown"}
Tags: ${school.tags?.join(", ") ?? "None"}
Nearby: ${nearbyInfo}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze this school for a parent searching for: "${userQuery}"

${schoolProfile}

Provide a comprehensive, helpful analysis. Be specific about the school's strengths and any considerations. Consider the school's neighborhood, transit access, and nearby amenities. Score 0-100 based on how well this school matches what the parent is looking for.`,
    config: {
      systemInstruction: `You are SchoolScope, an expert school advisor for Metro Vancouver families.
Provide balanced, informative analysis. Be specific — mention actual neighborhood names, transit lines, and nearby facilities.
For accentColor, use a hex color: green for nature-adjacent schools, blue for academic-focused, purple for arts, warm orange for community-oriented.
Score generously but fairly: 80-100 = excellent match, 60-79 = good match, 40-59 = partial match, below 40 = weak match.`,
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    },
  });

  return JSON.parse(response.text ?? "{}") as SchoolAnalysis;
}

export async function getNeighborhoodInsights(
  latitude: number,
  longitude: number,
  schoolNames: string[]
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `What is the neighborhood like around coordinates ${latitude}, ${longitude} in Metro Vancouver, BC?
Schools in this area include: ${schoolNames.join(", ")}.
Describe: walkability, family-friendliness, green spaces, transit access, housing types, and overall vibe for families with school-age children. Keep it to 3-4 sentences.`,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.5,
    },
  });

  return response.text ?? "Neighborhood information unavailable.";
}
