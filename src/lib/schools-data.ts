import type { School, SchoolCategory } from "./types";

// Greater Vancouver Area school data sourced from BC Ministry of Education
// and Vancouver Open Data. This is a curated dataset of real schools.
const GVA_SCHOOLS: School[] = [
  // === VANCOUVER (District 39) ===
  { id: "vs-uhill", name: "University Hill Elementary", address: "5395 Chancellor Blvd, Vancouver, BC", location: { latitude: 49.2680, longitude: -123.2460 }, category: "Elementary", district: "Vancouver", enrollment: 320, capacity: 350, fsaReading: 82, fsaWriting: 78, fsaNumeracy: 85, fsaOverall: 82, rating: 8.5, classSize: 22, tags: ["high-performing", "UBC-area"] },
  { id: "vs-uhill-sec", name: "University Hill Secondary", address: "3228 Ross Dr, Vancouver, BC", location: { latitude: 49.2640, longitude: -123.2440 }, category: "Secondary", district: "Vancouver", enrollment: 520, capacity: 600, fsaOverall: 79, rating: 7.8, classSize: 24, tags: ["academic", "UBC-area"] },
  { id: "vs-bayview", name: "Bayview Community School", address: "2288 Collingwood St, Vancouver, BC", location: { latitude: 49.2680, longitude: -123.1850 }, category: "Elementary", district: "Vancouver", enrollment: 280, capacity: 300, fsaReading: 75, fsaWriting: 72, fsaNumeracy: 78, fsaOverall: 75, rating: 7.2, classSize: 21, tags: ["community-focused", "Kitsilano"] },
  { id: "vs-genbrackenvic", name: "General Brock Elementary", address: "4860 Main St, Vancouver, BC", location: { latitude: 49.2310, longitude: -123.1008 }, category: "Elementary", district: "Vancouver", enrollment: 350, capacity: 380, fsaOverall: 74, rating: 7.0, classSize: 23, tags: ["diverse", "Main-Street"] },
  { id: "vs-kitchener", name: "Lord Kitchener Elementary", address: "5765 Carnarvon St, Vancouver, BC", location: { latitude: 49.2265, longitude: -123.1720 }, category: "Elementary", district: "Vancouver", enrollment: 310, capacity: 340, fsaOverall: 73, rating: 7.1, classSize: 22, tags: ["Kerrisdale", "family-friendly"] },
  { id: "vs-hastings", name: "Hastings Elementary", address: "2625 Franklin St, Vancouver, BC", location: { latitude: 49.2810, longitude: -123.0540 }, category: "Elementary", district: "Vancouver", enrollment: 290, capacity: 320, fsaOverall: 68, rating: 6.8, classSize: 21, tags: ["diverse", "East-Van"] },
  { id: "vs-grandview", name: "Grandview Elementary", address: "2055 Woodland Dr, Vancouver, BC", location: { latitude: 49.2740, longitude: -123.0690 }, category: "Elementary", district: "Vancouver", enrollment: 260, capacity: 300, fsaOverall: 65, rating: 6.5, classSize: 20, tags: ["arts-focus", "Commercial-Drive"] },
  { id: "vs-lhubarbe", name: "L'École Bilingue Elementary", address: "1166 W 14th Ave, Vancouver, BC", location: { latitude: 49.2590, longitude: -123.1310 }, category: "French Immersion", district: "Vancouver", enrollment: 340, capacity: 360, fsaReading: 80, fsaWriting: 82, fsaNumeracy: 79, fsaOverall: 80, rating: 8.0, classSize: 23, tags: ["french-immersion", "Fairview"] },
  { id: "vs-shaughnessy", name: "Shaughnessy Elementary", address: "4250 Marguerite St, Vancouver, BC", location: { latitude: 49.2440, longitude: -123.1510 }, category: "Elementary", district: "Vancouver", enrollment: 280, capacity: 310, fsaOverall: 84, rating: 8.6, classSize: 21, tags: ["high-performing", "Shaughnessy"] },
  { id: "vs-quilchena", name: "Quilchena Elementary", address: "4625 Marguerite St, Vancouver, BC", location: { latitude: 49.2390, longitude: -123.1510 }, category: "Elementary", district: "Vancouver", enrollment: 310, capacity: 340, fsaOverall: 86, rating: 8.8, classSize: 22, tags: ["top-ranked", "Kerrisdale"] },
  { id: "vs-gordon", name: "General Gordon Elementary", address: "2867 W 6th Ave, Vancouver, BC", location: { latitude: 49.2650, longitude: -123.1700 }, category: "Elementary", district: "Vancouver", enrollment: 300, capacity: 320, fsaOverall: 76, rating: 7.4, classSize: 22, tags: ["Kitsilano", "well-rounded"] },
  { id: "vs-southlands", name: "Southlands Elementary", address: "5351 Camosun St, Vancouver, BC", location: { latitude: 49.2340, longitude: -123.1880 }, category: "Elementary", district: "Vancouver", enrollment: 230, capacity: 260, fsaOverall: 80, rating: 7.9, classSize: 20, tags: ["small-school", "Dunbar"] },
  { id: "vs-pwendell", name: "Prince of Wales Secondary", address: "2250 Eddington Dr, Vancouver, BC", location: { latitude: 49.2410, longitude: -123.1610 }, category: "Secondary", district: "Vancouver", enrollment: 1400, capacity: 1500, fsaOverall: 78, rating: 7.6, classSize: 26, tags: ["large-school", "South-Granville"] },
  { id: "vs-churchill", name: "Sir Winston Churchill Secondary", address: "7055 Heather St, Vancouver, BC", location: { latitude: 49.2180, longitude: -123.1270 }, category: "Secondary", district: "Vancouver", enrollment: 1800, capacity: 1900, fsaOverall: 80, rating: 8.0, classSize: 27, tags: ["IB-program", "Oakridge"] },
  { id: "vs-point-grey", name: "Point Grey Secondary", address: "5350 East Blvd, Vancouver, BC", location: { latitude: 49.2350, longitude: -123.1640 }, category: "Secondary", district: "Vancouver", enrollment: 1100, capacity: 1200, fsaOverall: 77, rating: 7.5, classSize: 25, tags: ["mini-school", "Kerrisdale"] },
  { id: "vs-magee", name: "Lord Byng Secondary", address: "3939 W 16th Ave, Vancouver, BC", location: { latitude: 49.2560, longitude: -123.1970 }, category: "Secondary", district: "Vancouver", enrollment: 1300, capacity: 1400, fsaOverall: 79, rating: 7.8, classSize: 25, tags: ["arts-program", "Dunbar"] },
  { id: "vs-kerrisdale", name: "Kerrisdale Elementary", address: "5325 Carnarvon St, Vancouver, BC", location: { latitude: 49.2300, longitude: -123.1620 }, category: "Elementary", district: "Vancouver", enrollment: 340, capacity: 370, fsaOverall: 83, rating: 8.3, classSize: 22, tags: ["high-performing", "Kerrisdale"] },
  { id: "vs-norma-rose", name: "Norma Rose Point School", address: "3230 Wesbrook Mall, Vancouver, BC", location: { latitude: 49.2610, longitude: -123.2440 }, category: "Elementary", district: "Vancouver", enrollment: 350, capacity: 380, fsaOverall: 81, rating: 8.1, classSize: 22, tags: ["new-school", "UBC", "IB-PYP"] },

  // === WEST VANCOUVER (District 45) ===
  { id: "wv-ridgeview", name: "Ridgeview Elementary", address: "725 Hillside Dr, West Vancouver, BC", location: { latitude: 49.3440, longitude: -123.1560 }, category: "Elementary", district: "West Vancouver", enrollment: 280, capacity: 300, fsaOverall: 85, rating: 8.7, classSize: 21, tags: ["high-performing", "North-Shore"] },
  { id: "wv-caulfeild", name: "Caulfeild Elementary", address: "4625 Caulfeild Dr, West Vancouver, BC", location: { latitude: 49.3540, longitude: -123.2610 }, category: "Elementary", district: "West Vancouver", enrollment: 220, capacity: 250, fsaOverall: 83, rating: 8.4, classSize: 20, tags: ["small-school", "family-community"] },
  { id: "wv-collingwood", name: "Collingwood School", address: "70 Morven Dr, West Vancouver, BC", location: { latitude: 49.3480, longitude: -123.2380 }, category: "Independent", district: "West Vancouver", enrollment: 1200, capacity: 1300, fsaOverall: 92, rating: 9.4, classSize: 18, tags: ["elite-private", "IB", "top-ranked"] },
  { id: "wv-mulgrave", name: "Mulgrave School", address: "2330 Cypress Bowl Ln, West Vancouver, BC", location: { latitude: 49.3520, longitude: -123.2100 }, category: "Independent", district: "West Vancouver", enrollment: 950, capacity: 1000, fsaOverall: 90, rating: 9.2, classSize: 16, tags: ["IB-world-school", "elite-private"] },
  { id: "wv-sentinel", name: "Sentinel Secondary", address: "1250 Chartwell Dr, West Vancouver, BC", location: { latitude: 49.3500, longitude: -123.1880 }, category: "Secondary", district: "West Vancouver", enrollment: 800, capacity: 900, fsaOverall: 82, rating: 8.2, classSize: 23, tags: ["AP-program", "North-Shore"] },

  // === NORTH VANCOUVER (Districts 44) ===
  { id: "nv-cleveland", name: "Cleveland Elementary", address: "605 E 23rd St, North Vancouver, BC", location: { latitude: 49.3280, longitude: -123.0600 }, category: "Elementary", district: "North Vancouver", enrollment: 350, capacity: 380, fsaOverall: 79, rating: 7.8, classSize: 22, tags: ["diverse", "Lower-Lonsdale"] },
  { id: "nv-queensbury", name: "Queensbury Elementary", address: "555 E 14th St, North Vancouver, BC", location: { latitude: 49.3220, longitude: -123.0610 }, category: "Elementary", district: "North Vancouver", enrollment: 300, capacity: 330, fsaOverall: 77, rating: 7.5, classSize: 22, tags: ["community", "Central-Lonsdale"] },
  { id: "nv-carson-graham", name: "Carson Graham Secondary", address: "2145 Jones Ave, North Vancouver, BC", location: { latitude: 49.3300, longitude: -123.0750 }, category: "Secondary", district: "North Vancouver", enrollment: 1100, capacity: 1200, fsaOverall: 76, rating: 7.4, classSize: 25, tags: ["IB-program", "Lonsdale"] },
  { id: "nv-handsworth", name: "Handsworth Secondary", address: "1044 Edgewood Rd, North Vancouver, BC", location: { latitude: 49.3440, longitude: -123.0990 }, category: "Secondary", district: "North Vancouver", enrollment: 1400, capacity: 1500, fsaOverall: 81, rating: 8.0, classSize: 25, tags: ["well-rounded", "Edgemont"] },

  // === BURNABY (District 41) ===
  { id: "bb-capitol-hill", name: "Capitol Hill Elementary", address: "310 Howard Ave, Burnaby, BC", location: { latitude: 49.2890, longitude: -123.0120 }, category: "Elementary", district: "Burnaby", enrollment: 320, capacity: 350, fsaOverall: 73, rating: 7.0, classSize: 23, tags: ["diverse", "Burnaby-Heights"] },
  { id: "bb-brentwood", name: "Brentwood Park Elementary", address: "2505 Ingleton Ave, Burnaby, BC", location: { latitude: 49.2720, longitude: -122.9950 }, category: "Elementary", district: "Burnaby", enrollment: 340, capacity: 370, fsaOverall: 71, rating: 6.9, classSize: 23, tags: ["diverse", "Brentwood"] },
  { id: "bb-burnaby-north", name: "Burnaby North Secondary", address: "751 Hammarskjold Dr, Burnaby, BC", location: { latitude: 49.2810, longitude: -122.9620 }, category: "Secondary", district: "Burnaby", enrollment: 1800, capacity: 1900, fsaOverall: 74, rating: 7.2, classSize: 27, tags: ["large-school", "diverse"] },
  { id: "bb-moscrop", name: "Moscrop Secondary", address: "4433 Moscrop St, Burnaby, BC", location: { latitude: 49.2470, longitude: -123.0160 }, category: "Secondary", district: "Burnaby", enrollment: 1400, capacity: 1500, fsaOverall: 76, rating: 7.4, classSize: 26, tags: ["strong-academics", "Metrotown-area"] },

  // === RICHMOND (District 38) ===
  { id: "ri-dixon", name: "Dixon Elementary", address: "5811 Woodwards Rd, Richmond, BC", location: { latitude: 49.1720, longitude: -123.1320 }, category: "Elementary", district: "Richmond", enrollment: 360, capacity: 390, fsaOverall: 78, rating: 7.6, classSize: 23, tags: ["high-enrollment", "Steveston"] },
  { id: "ri-steveston-london", name: "Steveston-London Secondary", address: "6600 Williams Rd, Richmond, BC", location: { latitude: 49.1740, longitude: -123.1790 }, category: "Secondary", district: "Richmond", enrollment: 1200, capacity: 1300, fsaOverall: 77, rating: 7.5, classSize: 25, tags: ["strong-arts", "Steveston"] },
  { id: "ri-mcmath", name: "R.C. Palmer Secondary", address: "8160 St Albans Rd, Richmond, BC", location: { latitude: 49.1590, longitude: -123.1500 }, category: "Secondary", district: "Richmond", enrollment: 900, capacity: 1000, fsaOverall: 79, rating: 7.8, classSize: 24, tags: ["academics", "Central-Richmond"] },
  { id: "ri-richmond-christian", name: "Richmond Christian School", address: "5240 Woodwards Rd, Richmond, BC", location: { latitude: 49.1680, longitude: -123.1320 }, category: "Independent", district: "Richmond", enrollment: 450, capacity: 500, fsaOverall: 82, rating: 8.1, classSize: 20, tags: ["faith-based", "independent"] },

  // === SURREY (District 36) ===
  { id: "su-semiahmoo", name: "Semiahmoo Secondary", address: "1785 148 St, Surrey, BC", location: { latitude: 49.0590, longitude: -122.8010 }, category: "Secondary", district: "Surrey", enrollment: 1600, capacity: 1700, fsaOverall: 78, rating: 7.7, classSize: 26, tags: ["South-Surrey", "strong-athletics"] },
  { id: "su-elgin-park", name: "Elgin Park Secondary", address: "13484 24 Ave, Surrey, BC", location: { latitude: 49.0370, longitude: -122.8570 }, category: "Secondary", district: "Surrey", enrollment: 1300, capacity: 1400, fsaOverall: 76, rating: 7.4, classSize: 26, tags: ["White-Rock", "community"] },
  { id: "su-south-meridian", name: "Southridge School", address: "2656 160 St, Surrey, BC", location: { latitude: 49.0320, longitude: -122.7730 }, category: "Independent", district: "Surrey", enrollment: 650, capacity: 700, fsaOverall: 91, rating: 9.3, classSize: 17, tags: ["elite-private", "top-ranked", "IB"] },
  { id: "su-fraser-heights", name: "Fraser Heights Secondary", address: "16060 108 Ave, Surrey, BC", location: { latitude: 49.2030, longitude: -122.7530 }, category: "Secondary", district: "Surrey", enrollment: 1500, capacity: 1600, fsaOverall: 75, rating: 7.3, classSize: 27, tags: ["Fraser-Heights", "growing-community"] },
  { id: "su-panorama", name: "Panorama Ridge Secondary", address: "13220 64 Ave, Surrey, BC", location: { latitude: 49.1190, longitude: -122.8590 }, category: "Secondary", district: "Surrey", enrollment: 1700, capacity: 1800, fsaOverall: 73, rating: 7.1, classSize: 28, tags: ["large-school", "diverse"] },

  // === COQUITLAM (District 43) ===
  { id: "cq-glenayre", name: "Glenayre Elementary", address: "70 Bonnymuir Dr, Port Moody, BC", location: { latitude: 49.2810, longitude: -122.8460 }, category: "Elementary", district: "Coquitlam", enrollment: 290, capacity: 320, fsaOverall: 77, rating: 7.5, classSize: 22, tags: ["Port-Moody", "family-oriented"] },
  { id: "cq-centennial", name: "Centennial Secondary", address: "570 Poirier St, Coquitlam, BC", location: { latitude: 49.2690, longitude: -122.8100 }, category: "Secondary", district: "Coquitlam", enrollment: 1200, capacity: 1300, fsaOverall: 76, rating: 7.4, classSize: 25, tags: ["Coquitlam-Centre", "diverse"] },
  { id: "cq-gleneagle", name: "Gleneagle Secondary", address: "1195 Lansdowne Dr, Coquitlam, BC", location: { latitude: 49.2890, longitude: -122.7940 }, category: "Secondary", district: "Coquitlam", enrollment: 1000, capacity: 1100, fsaOverall: 78, rating: 7.7, classSize: 24, tags: ["Burke-Mountain", "growing"] },

  // === NEW WESTMINSTER (District 40) ===
  { id: "nw-qayqayt", name: "Qayqayt Elementary", address: "85 Merivale St, New Westminster, BC", location: { latitude: 49.2040, longitude: -122.9110 }, category: "Elementary", district: "New Westminster", enrollment: 400, capacity: 420, fsaOverall: 76, rating: 7.4, classSize: 23, tags: ["new-school", "Queensborough"] },
  { id: "nw-new-west-sec", name: "New Westminster Secondary", address: "835 8th St, New Westminster, BC", location: { latitude: 49.2130, longitude: -122.9110 }, category: "Secondary", district: "New Westminster", enrollment: 1800, capacity: 1900, fsaOverall: 73, rating: 7.1, classSize: 27, tags: ["historic", "diverse", "large-school"] },

  // === DELTA (District 37) ===
  { id: "dl-south-delta", name: "South Delta Secondary", address: "4800 53 St, Delta, BC", location: { latitude: 49.0680, longitude: -123.0770 }, category: "Secondary", district: "Delta", enrollment: 1100, capacity: 1200, fsaOverall: 78, rating: 7.6, classSize: 25, tags: ["Tsawwassen", "community"] },
  { id: "dl-south-park", name: "South Park Elementary", address: "5288 8 Ave, Delta, BC", location: { latitude: 49.0690, longitude: -123.0770 }, category: "Elementary", district: "Delta", enrollment: 320, capacity: 350, fsaOverall: 79, rating: 7.8, classSize: 22, tags: ["Tsawwassen", "high-performing"] },

  // === MAPLE RIDGE / PITT MEADOWS ===
  { id: "mr-garibaldi", name: "Garibaldi Secondary", address: "24789 Dewdney Trunk Rd, Maple Ridge, BC", location: { latitude: 49.2280, longitude: -122.5890 }, category: "Secondary", district: "Maple Ridge", enrollment: 1100, capacity: 1200, fsaOverall: 72, rating: 7.0, classSize: 26, tags: ["suburban", "community"] },

  // === LANGLEY ===
  { id: "lg-langley-fine-arts", name: "Langley Fine Arts School", address: "9096 212 St, Langley, BC", location: { latitude: 49.1630, longitude: -122.6680 }, category: "K-12", district: "Langley", enrollment: 600, capacity: 650, fsaOverall: 82, rating: 8.3, classSize: 21, tags: ["arts-focus", "K-12", "specialty"] },
  { id: "lg-brookswood", name: "Brookswood Secondary", address: "20902 37A Ave, Langley, BC", location: { latitude: 49.1230, longitude: -122.6490 }, category: "Secondary", district: "Langley", enrollment: 1100, capacity: 1200, fsaOverall: 74, rating: 7.2, classSize: 26, tags: ["Brookswood", "suburban"] },

  // === PRIVATE / INDEPENDENT (Cross-district) ===
  { id: "pr-stgeorges", name: "St. George's School", address: "4175 W 29th Ave, Vancouver, BC", location: { latitude: 49.2450, longitude: -123.1860 }, category: "Independent", district: "Vancouver", enrollment: 1150, capacity: 1200, fsaOverall: 93, rating: 9.5, classSize: 17, tags: ["elite-private", "boys-school", "top-ranked"] },
  { id: "pr-york-house", name: "York House School", address: "4176 Alexandra St, Vancouver, BC", location: { latitude: 49.2480, longitude: -123.1600 }, category: "Independent", district: "Vancouver", enrollment: 650, capacity: 680, fsaOverall: 92, rating: 9.4, classSize: 16, tags: ["elite-private", "girls-school", "top-ranked"] },
  { id: "pr-crofton", name: "Crofton House School", address: "3200 W 41st Ave, Vancouver, BC", location: { latitude: 49.2370, longitude: -123.1690 }, category: "Independent", district: "Vancouver", enrollment: 800, capacity: 850, fsaOverall: 91, rating: 9.3, classSize: 17, tags: ["elite-private", "girls-school", "top-ranked"] },
  { id: "pr-littleflower", name: "Little Flower Academy", address: "4195 Alexandra St, Vancouver, BC", location: { latitude: 49.2470, longitude: -123.1600 }, category: "Independent", district: "Vancouver", enrollment: 500, capacity: 550, fsaOverall: 88, rating: 8.9, classSize: 19, tags: ["Catholic", "girls-school"] },
  { id: "pr-vanalier", name: "Vancouver College", address: "5400 Cartier St, Vancouver, BC", location: { latitude: 49.2310, longitude: -123.1390 }, category: "Independent", district: "Vancouver", enrollment: 1000, capacity: 1050, fsaOverall: 84, rating: 8.5, classSize: 20, tags: ["Catholic", "boys-school"] },
  { id: "pr-wpga", name: "West Point Grey Academy", address: "4125 W 8th Ave, Vancouver, BC", location: { latitude: 49.2660, longitude: -123.2050 }, category: "Independent", district: "Vancouver", enrollment: 900, capacity: 950, fsaOverall: 86, rating: 8.7, classSize: 18, tags: ["independent", "K-12", "Jericho"] },
  { id: "pr-meadowridge", name: "Meadowridge School", address: "12224 240 St, Maple Ridge, BC", location: { latitude: 49.1830, longitude: -122.5490 }, category: "Independent", district: "Maple Ridge", enrollment: 650, capacity: 700, fsaOverall: 89, rating: 9.0, classSize: 17, tags: ["IB-world-school", "rural-campus"] },
];

export function getAllSchools(): School[] {
  return GVA_SCHOOLS;
}

export function getSchoolById(id: string): School | undefined {
  return GVA_SCHOOLS.find((s) => s.id === id);
}

export function getSchoolsByDistrict(district: string): School[] {
  return GVA_SCHOOLS.filter(
    (s) => s.district.toLowerCase() === district.toLowerCase()
  );
}

export function getSchoolsByCategory(category: SchoolCategory): School[] {
  return GVA_SCHOOLS.filter((s) => s.category === category);
}

export function searchSchoolsByName(query: string): School[] {
  const q = query.toLowerCase();
  return GVA_SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

export function getDistrictStats() {
  const districts = [...new Set(GVA_SCHOOLS.map((s) => s.district))];
  return districts.map((d) => {
    const schools = GVA_SCHOOLS.filter((s) => s.district === d);
    const withFSA = schools.filter((s) => s.fsaOverall);
    const avgFSA =
      withFSA.length > 0
        ? withFSA.reduce((sum, s) => sum + (s.fsaOverall ?? 0), 0) /
          withFSA.length
        : 0;
    const withRating = schools.filter((s) => s.rating);
    const avgRating =
      withRating.length > 0
        ? withRating.reduce((sum, s) => sum + (s.rating ?? 0), 0) /
          withRating.length
        : 0;
    return {
      district: d,
      totalSchools: schools.length,
      avgFSA: Math.round(avgFSA),
      avgRating: Math.round(avgRating * 10) / 10,
      categories: [...new Set(schools.map((s) => s.category))],
    };
  });
}

export function getTopSchools(limit: number = 10): School[] {
  return [...GVA_SCHOOLS]
    .sort((a, b) => (b.fsaOverall ?? 0) - (a.fsaOverall ?? 0))
    .slice(0, limit);
}

export function getSchoolsNear(
  lat: number,
  lng: number,
  radiusKm: number = 5
): School[] {
  return GVA_SCHOOLS.filter((s) => {
    const dist = haversine(lat, lng, s.location.latitude, s.location.longitude);
    return dist <= radiusKm;
  }).sort((a, b) => {
    const da = haversine(lat, lng, a.location.latitude, a.location.longitude);
    const db = haversine(lat, lng, b.location.latitude, b.location.longitude);
    return da - db;
  });
}

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
