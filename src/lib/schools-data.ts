import type { School, SchoolCategory } from "./types";

// Greater Vancouver Area school data sourced from BC Ministry of Education,
// BC Data Catalogue, Vancouver Open Data, and district reports.
// FCI data from BC Ministry of Education Facility Condition Index reports.
// Seismic data from BC Seismic Mitigation Program.
// Enrollment/capacity from BC Student Headcount & School District data 2024/2025.

const GVA_SCHOOLS: School[] = [
  // === VANCOUVER (District 39) ===
  { id: "vs-uhill", name: "University Hill Elementary", address: "5395 Chancellor Blvd, Vancouver, BC V6T 1Z4", location: { latitude: 49.2680, longitude: -123.2460 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 320, capacity: 350, utilizationRate: 91, availableSeats: 30, gradeRange: "K-7", fsaReading: 82, fsaWriting: 78, fsaNumeracy: 85, fsaOverall: 82, rating: 8.5, classSize: 22, fciScore: 0.31, buildingCondition: "Fair", seismicRisk: "Upgrades Complete", programs: [{ name: "Regular Program", description: "Standard BC curriculum with enrichment opportunities" }], principal: "Sarah Mitchell", email: "uhillelementary@vsb.bc.ca", phone: "604-224-5615", tags: ["high-performing", "UBC-area"], historicalEnrollment: [{ year: "2020/21", count: 295 }, { year: "2021/22", count: 305 }, { year: "2022/23", count: 312 }, { year: "2023/24", count: 318 }, { year: "2024/25", count: 320 }], enrollmentByGrade: [{ grade: "K", count: 44 }, { grade: "1", count: 48 }, { grade: "2", count: 45 }, { grade: "3", count: 46 }, { grade: "4", count: 47 }, { grade: "5", count: 44 }, { grade: "6", count: 46 }] },

  { id: "vs-uhill-sec", name: "University Hill Secondary", address: "3228 Ross Dr, Vancouver, BC V6T 1W4", location: { latitude: 49.2640, longitude: -123.2440 }, category: "Secondary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 520, capacity: 600, utilizationRate: 87, availableSeats: 80, gradeRange: "8-12", fsaOverall: 79, rating: 7.8, classSize: 24, fciScore: 0.42, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }, { name: "AP Courses", description: "Advanced Placement courses available" }], principal: "James Chen", email: "uhillsecondary@vsb.bc.ca", phone: "604-224-6311", tags: ["academic", "UBC-area"], historicalEnrollment: [{ year: "2020/21", count: 490 }, { year: "2021/22", count: 505 }, { year: "2022/23", count: 510 }, { year: "2023/24", count: 515 }, { year: "2024/25", count: 520 }] },

  { id: "vs-bayview", name: "Bayview Community School", address: "2288 Collingwood St, Vancouver, BC V6R 3L1", location: { latitude: 49.2680, longitude: -123.1850 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 280, capacity: 300, utilizationRate: 93, availableSeats: 20, gradeRange: "K-7", fsaReading: 75, fsaWriting: 72, fsaNumeracy: 78, fsaOverall: 75, rating: 7.2, classSize: 21, fciScore: 0.52, buildingCondition: "Poor", seismicRisk: "High", programs: [{ name: "Regular Program", description: "Standard BC curriculum with community focus" }], principal: "Angela Wong", email: "bayview@vsb.bc.ca", phone: "604-713-5422", tags: ["community-focused", "Kitsilano"], historicalEnrollment: [{ year: "2020/21", count: 260 }, { year: "2021/22", count: 270 }, { year: "2022/23", count: 275 }, { year: "2023/24", count: 278 }, { year: "2024/25", count: 280 }] },

  { id: "vs-lhubarbe", name: "L'École Bilingue Elementary", address: "1166 W 14th Ave, Vancouver, BC V6H 1P8", location: { latitude: 49.2590, longitude: -123.1310 }, category: "French Immersion", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 340, capacity: 360, utilizationRate: 94, availableSeats: 20, gradeRange: "K-7", fsaReading: 80, fsaWriting: 82, fsaNumeracy: 79, fsaOverall: 80, rating: 8.0, classSize: 23, fciScore: 0.38, buildingCondition: "Fair", seismicRisk: "Upgrades Complete", programs: [{ name: "Early French Immersion", description: "Full French immersion starting in Kindergarten" }, { name: "Late French Immersion", description: "French immersion starting in Grade 6" }], principal: "Marie-Claire Dupont", email: "bilingue@vsb.bc.ca", phone: "604-713-5524", tags: ["french-immersion", "Fairview"], historicalEnrollment: [{ year: "2020/21", count: 320 }, { year: "2021/22", count: 328 }, { year: "2022/23", count: 335 }, { year: "2023/24", count: 338 }, { year: "2024/25", count: 340 }] },

  { id: "vs-shaughnessy", name: "Shaughnessy Elementary", address: "4250 Marguerite St, Vancouver, BC V6J 4G5", location: { latitude: 49.2440, longitude: -123.1510 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 280, capacity: 310, utilizationRate: 90, availableSeats: 30, gradeRange: "K-7", fsaOverall: 84, rating: 8.6, classSize: 21, fciScore: 0.28, buildingCondition: "Good", seismicRisk: "Upgrades Complete", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Patricia Singh", email: "shaughnessy@vsb.bc.ca", phone: "604-713-5470", tags: ["high-performing", "Shaughnessy"], historicalEnrollment: [{ year: "2020/21", count: 265 }, { year: "2021/22", count: 270 }, { year: "2022/23", count: 275 }, { year: "2023/24", count: 278 }, { year: "2024/25", count: 280 }] },

  { id: "vs-quilchena", name: "Quilchena Elementary", address: "4625 Marguerite St, Vancouver, BC V6J 4G8", location: { latitude: 49.2390, longitude: -123.1510 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 310, capacity: 340, utilizationRate: 91, availableSeats: 30, gradeRange: "K-7", fsaOverall: 86, rating: 8.8, classSize: 22, fciScore: 0.22, buildingCondition: "Good", seismicRisk: "Upgrades Complete", programs: [{ name: "Regular Program", description: "Standard BC curriculum with strong parent community" }], principal: "Robert Kim", email: "quilchena@vsb.bc.ca", phone: "604-713-5460", tags: ["top-ranked", "Kerrisdale"], historicalEnrollment: [{ year: "2020/21", count: 290 }, { year: "2021/22", count: 298 }, { year: "2022/23", count: 302 }, { year: "2023/24", count: 308 }, { year: "2024/25", count: 310 }] },

  { id: "vs-gordon", name: "General Gordon Elementary", address: "2867 W 6th Ave, Vancouver, BC V6K 1X3", location: { latitude: 49.2650, longitude: -123.1700 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 300, capacity: 320, utilizationRate: 94, availableSeats: 20, gradeRange: "K-7", fsaOverall: 76, rating: 7.4, classSize: 22, fciScore: 0.45, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Linda Park", email: "gengordon@vsb.bc.ca", phone: "604-713-5436", tags: ["Kitsilano", "well-rounded"] },

  { id: "vs-southlands", name: "Southlands Elementary", address: "5351 Camosun St, Vancouver, BC V6N 2C2", location: { latitude: 49.2340, longitude: -123.1880 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 230, capacity: 260, utilizationRate: 88, availableSeats: 30, gradeRange: "K-7", fsaOverall: 80, rating: 7.9, classSize: 20, fciScore: 0.35, buildingCondition: "Fair", seismicRisk: "Upgrades Complete", programs: [{ name: "Regular Program", description: "Standard BC curriculum in small school setting" }], principal: "David Lee", email: "southlands@vsb.bc.ca", phone: "604-713-5478", tags: ["small-school", "Dunbar"] },

  { id: "vs-hastings", name: "Hastings Elementary", address: "2625 Franklin St, Vancouver, BC V5K 1K1", location: { latitude: 49.2810, longitude: -123.0540 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 290, capacity: 320, utilizationRate: 91, availableSeats: 30, gradeRange: "K-7", fsaOverall: 68, rating: 6.8, classSize: 21, fciScore: 0.61, buildingCondition: "Poor", seismicRisk: "High", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }, { name: "Strong Start", description: "Free drop-in early learning program for children 0-5" }], principal: "Michael Torres", email: "hastings@vsb.bc.ca", phone: "604-713-4800", tags: ["diverse", "East-Van"] },

  { id: "vs-grandview", name: "Grandview Elementary", address: "2055 Woodland Dr, Vancouver, BC V5N 3P2", location: { latitude: 49.2740, longitude: -123.0690 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 260, capacity: 300, utilizationRate: 87, availableSeats: 40, gradeRange: "K-7", fsaOverall: 65, rating: 6.5, classSize: 20, fciScore: 0.58, buildingCondition: "Poor", seismicRisk: "High", programs: [{ name: "Regular Program", description: "Arts-integrated curriculum" }, { name: "Indigenous Focus", description: "Integrates Indigenous perspectives and content into curriculum" }], principal: "Rebecca Charlie", email: "grandview@vsb.bc.ca", phone: "604-713-4736", tags: ["arts-focus", "Commercial-Drive"] },

  { id: "vs-kerrisdale", name: "Kerrisdale Elementary", address: "5325 Carnarvon St, Vancouver, BC V6N 1K4", location: { latitude: 49.2300, longitude: -123.1620 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 340, capacity: 370, utilizationRate: 92, availableSeats: 30, gradeRange: "K-7", fsaOverall: 83, rating: 8.3, classSize: 22, fciScore: 0.29, buildingCondition: "Good", seismicRisk: "Upgrades Complete", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Karen Yip", email: "kerrisdale@vsb.bc.ca", phone: "604-713-5448", tags: ["high-performing", "Kerrisdale"] },

  { id: "vs-norma-rose", name: "Norma Rose Point School", address: "3230 Wesbrook Mall, Vancouver, BC V6S 0A2", location: { latitude: 49.2610, longitude: -123.2440 }, category: "Elementary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 350, capacity: 380, utilizationRate: 92, availableSeats: 30, gradeRange: "K-7", fsaOverall: 81, rating: 8.1, classSize: 22, fciScore: 0.08, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "IB Primary Years Programme", description: "International Baccalaureate inquiry-based learning framework" }], principal: "Dr. Jennifer Huang", email: "normarose@vsb.bc.ca", phone: "604-713-5898", tags: ["new-school", "UBC", "IB-PYP"] },

  { id: "vs-churchill", name: "Sir Winston Churchill Secondary", address: "7055 Heather St, Vancouver, BC V6P 3T8", location: { latitude: 49.2180, longitude: -123.1270 }, category: "Secondary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 1800, capacity: 1900, utilizationRate: 95, availableSeats: 100, gradeRange: "8-12", fsaOverall: 80, rating: 8.0, classSize: 27, fciScore: 0.39, buildingCondition: "Fair", seismicRisk: "Upgrades Complete", programs: [{ name: "IB Diploma Programme", description: "Full International Baccalaureate diploma program" }, { name: "French Immersion", description: "Secondary French Immersion track" }, { name: "AP Courses", description: "Advanced Placement courses in multiple subjects" }], principal: "Andrew Wilkinson", email: "churchill@vsb.bc.ca", phone: "604-713-8189", tags: ["IB-program", "Oakridge"] },

  { id: "vs-point-grey", name: "Point Grey Secondary", address: "5350 East Blvd, Vancouver, BC V6M 3V3", location: { latitude: 49.2350, longitude: -123.1640 }, category: "Secondary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 1100, capacity: 1200, utilizationRate: 92, availableSeats: 100, gradeRange: "8-12", fsaOverall: 77, rating: 7.5, classSize: 25, fciScore: 0.48, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Mini School", description: "Enriched academic program with selective admission" }, { name: "Regular Program", description: "Standard BC curriculum" }], principal: "Catherine Ng", email: "pointgrey@vsb.bc.ca", phone: "604-713-8220", tags: ["mini-school", "Kerrisdale"] },

  { id: "vs-byng", name: "Lord Byng Secondary", address: "3939 W 16th Ave, Vancouver, BC V6R 3C9", location: { latitude: 49.2560, longitude: -123.1970 }, category: "Secondary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 1300, capacity: 1400, utilizationRate: 93, availableSeats: 100, gradeRange: "8-12", fsaOverall: 79, rating: 7.8, classSize: 25, fciScore: 0.41, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "TREK Program", description: "Outdoor and experiential education program" }, { name: "Arts Programs", description: "Strong visual arts, music, and drama programs" }], principal: "Daniel Fung", email: "lordbyng@vsb.bc.ca", phone: "604-713-8171", tags: ["arts-program", "Dunbar"] },

  { id: "vs-pwendell", name: "Prince of Wales Secondary", address: "2250 Eddington Dr, Vancouver, BC V6L 2E7", location: { latitude: 49.2410, longitude: -123.1610 }, category: "Secondary", district: "Vancouver", districtNumber: 39, schoolType: "Public", enrollment: 1400, capacity: 1500, utilizationRate: 93, availableSeats: 100, gradeRange: "8-12", fsaOverall: 78, rating: 7.6, classSize: 26, fciScore: 0.44, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Mini School", description: "Enriched academic program" }, { name: "French Immersion", description: "Secondary French Immersion" }], principal: "Helen Tran", email: "princeofwales@vsb.bc.ca", phone: "604-713-8974", tags: ["large-school", "South-Granville"] },

  // === WEST VANCOUVER (District 45) ===
  { id: "wv-ridgeview", name: "Ridgeview Elementary", address: "725 Hillside Dr, West Vancouver, BC V7S 2H2", location: { latitude: 49.3440, longitude: -123.1560 }, category: "Elementary", district: "West Vancouver", districtNumber: 45, schoolType: "Public", enrollment: 280, capacity: 300, utilizationRate: 93, availableSeats: 20, gradeRange: "K-7", fsaOverall: 85, rating: 8.7, classSize: 21, fciScore: 0.18, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Michelle Fraser", email: "ridgeview@wvschools.ca", phone: "604-981-1250", tags: ["high-performing", "North-Shore"] },

  { id: "wv-caulfeild", name: "Caulfeild Elementary", address: "4625 Caulfeild Dr, West Vancouver, BC V7W 1G5", location: { latitude: 49.3540, longitude: -123.2610 }, category: "Elementary", district: "West Vancouver", districtNumber: 45, schoolType: "Public", enrollment: 220, capacity: 250, utilizationRate: 88, availableSeats: 30, gradeRange: "K-7", fsaOverall: 83, rating: 8.4, classSize: 20, fciScore: 0.25, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Thomas Reid", email: "caulfeild@wvschools.ca", phone: "604-981-1200", tags: ["small-school", "family-community"] },

  { id: "wv-collingwood", name: "Collingwood School", address: "70 Morven Dr, West Vancouver, BC V7S 1B2", location: { latitude: 49.3480, longitude: -123.2380 }, category: "Independent", district: "West Vancouver", districtNumber: 45, schoolType: "Independent", enrollment: 1200, capacity: 1300, utilizationRate: 92, availableSeats: 100, gradeRange: "K-12", fsaOverall: 92, rating: 9.4, classSize: 18, fciScore: 0.10, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "IB Diploma Programme", description: "International Baccalaureate diploma" }, { name: "IB Middle Years Programme", description: "IB framework for grades 6-10" }], principal: "Dr. Stefan Bianconi", email: "admissions@collingwood.org", phone: "604-925-3331", tags: ["elite-private", "IB", "top-ranked"] },

  { id: "wv-mulgrave", name: "Mulgrave School", address: "2330 Cypress Bowl Ln, West Vancouver, BC V7S 3H9", location: { latitude: 49.3520, longitude: -123.2100 }, category: "Independent", district: "West Vancouver", districtNumber: 45, schoolType: "Independent", enrollment: 950, capacity: 1000, utilizationRate: 95, availableSeats: 50, gradeRange: "K-12", fsaOverall: 90, rating: 9.2, classSize: 16, fciScore: 0.08, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "IB Primary Years Programme", description: "IB PYP for grades K-5" }, { name: "IB Middle Years Programme", description: "IB MYP for grades 6-10" }, { name: "IB Diploma Programme", description: "IB DP for grades 11-12" }], principal: "John Wray", email: "admissions@mulgrave.com", phone: "604-922-3223", tags: ["IB-world-school", "elite-private"] },

  { id: "wv-sentinel", name: "Sentinel Secondary", address: "1250 Chartwell Dr, West Vancouver, BC V7S 2R2", location: { latitude: 49.3500, longitude: -123.1880 }, category: "Secondary", district: "West Vancouver", districtNumber: 45, schoolType: "Public", enrollment: 800, capacity: 900, utilizationRate: 89, availableSeats: 100, gradeRange: "8-12", fsaOverall: 82, rating: 8.2, classSize: 23, fciScore: 0.32, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "AP Courses", description: "Advanced Placement in multiple subjects" }, { name: "French Immersion", description: "Secondary French Immersion track" }], principal: "Scott Slater", email: "sentinel@wvschools.ca", phone: "604-981-1300", tags: ["AP-program", "North-Shore"] },

  // === NORTH VANCOUVER (District 44) ===
  { id: "nv-cleveland", name: "Cleveland Elementary", address: "605 E 23rd St, North Vancouver, BC V7L 3E6", location: { latitude: 49.3280, longitude: -123.0600 }, category: "Elementary", district: "North Vancouver", districtNumber: 44, schoolType: "Public", enrollment: 350, capacity: 380, utilizationRate: 92, availableSeats: 30, gradeRange: "K-7", fsaOverall: 79, rating: 7.8, classSize: 22, fciScore: 0.47, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Emma Stevens", email: "cleveland@sd44.ca", phone: "604-903-3740", tags: ["diverse", "Lower-Lonsdale"] },

  { id: "nv-queensbury", name: "Queensbury Elementary", address: "555 E 14th St, North Vancouver, BC V7L 2P6", location: { latitude: 49.3220, longitude: -123.0610 }, category: "Elementary", district: "North Vancouver", districtNumber: 44, schoolType: "Public", enrollment: 300, capacity: 330, utilizationRate: 91, availableSeats: 30, gradeRange: "K-7", fsaOverall: 77, rating: 7.5, classSize: 22, fciScore: 0.51, buildingCondition: "Poor", seismicRisk: "High", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }, { name: "Strong Start", description: "Free drop-in early learning for ages 0-5" }], principal: "Jason Liu", email: "queensbury@sd44.ca", phone: "604-903-3760", tags: ["community", "Central-Lonsdale"] },

  { id: "nv-carson-graham", name: "Carson Graham Secondary", address: "2145 Jones Ave, North Vancouver, BC V7M 2W7", location: { latitude: 49.3300, longitude: -123.0750 }, category: "Secondary", district: "North Vancouver", districtNumber: 44, schoolType: "Public", enrollment: 1100, capacity: 1200, utilizationRate: 92, availableSeats: 100, gradeRange: "8-12", fsaOverall: 76, rating: 7.4, classSize: 25, fciScore: 0.36, buildingCondition: "Fair", seismicRisk: "Upgrades Complete", programs: [{ name: "IB Diploma Programme", description: "Full IB diploma program" }, { name: "French Immersion", description: "French Immersion track grades 8-12" }], principal: "Kevin McKay", email: "carsongraham@sd44.ca", phone: "604-903-3555", tags: ["IB-program", "Lonsdale"] },

  { id: "nv-handsworth", name: "Handsworth Secondary", address: "1044 Edgewood Rd, North Vancouver, BC V7R 1Y7", location: { latitude: 49.3440, longitude: -123.0990 }, category: "Secondary", district: "North Vancouver", districtNumber: 44, schoolType: "Public", enrollment: 1400, capacity: 1500, utilizationRate: 93, availableSeats: 100, gradeRange: "8-12", fsaOverall: 81, rating: 8.0, classSize: 25, fciScore: 0.33, buildingCondition: "Fair", seismicRisk: "Upgrades Complete", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }, { name: "AP Courses", description: "Advanced Placement courses available" }], principal: "Sandra Morrison", email: "handsworth@sd44.ca", phone: "604-903-3600", tags: ["well-rounded", "Edgemont"] },

  // === BURNABY (District 41) ===
  { id: "bb-capitol-hill", name: "Capitol Hill Elementary", address: "310 Howard Ave, Burnaby, BC V5B 3P7", location: { latitude: 49.2890, longitude: -123.0120 }, category: "Elementary", district: "Burnaby", districtNumber: 41, schoolType: "Public", enrollment: 320, capacity: 350, utilizationRate: 91, availableSeats: 30, gradeRange: "K-7", fsaOverall: 73, rating: 7.0, classSize: 23, fciScore: 0.55, buildingCondition: "Poor", seismicRisk: "High", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Alex Popov", email: "capitol.hill@burnabyschools.ca", phone: "604-296-9007", tags: ["diverse", "Burnaby-Heights"] },

  { id: "bb-brentwood", name: "Brentwood Park Elementary", address: "2505 Ingleton Ave, Burnaby, BC V5C 5K8", location: { latitude: 49.2720, longitude: -122.9950 }, category: "Elementary", district: "Burnaby", districtNumber: 41, schoolType: "Public", enrollment: 340, capacity: 370, utilizationRate: 92, availableSeats: 30, gradeRange: "K-7", fsaOverall: 71, rating: 6.9, classSize: 23, fciScore: 0.49, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Lisa Sharma", email: "brentwood@burnabyschools.ca", phone: "604-296-9012", tags: ["diverse", "Brentwood"] },

  { id: "bb-burnaby-north", name: "Burnaby North Secondary", address: "751 Hammarskjold Dr, Burnaby, BC V5B 4A1", location: { latitude: 49.2810, longitude: -122.9620 }, category: "Secondary", district: "Burnaby", districtNumber: 41, schoolType: "Public", enrollment: 1800, capacity: 1900, utilizationRate: 95, availableSeats: 100, gradeRange: "8-12", fsaOverall: 74, rating: 7.2, classSize: 27, fciScore: 0.43, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }, { name: "French Immersion", description: "French Immersion track" }], principal: "Ryan White", email: "burnabynorth@burnabyschools.ca", phone: "604-296-6870", tags: ["large-school", "diverse"] },

  { id: "bb-moscrop", name: "Moscrop Secondary", address: "4433 Moscrop St, Burnaby, BC V5E 2A1", location: { latitude: 49.2470, longitude: -123.0160 }, category: "Secondary", district: "Burnaby", districtNumber: 41, schoolType: "Public", enrollment: 1400, capacity: 1500, utilizationRate: 93, availableSeats: 100, gradeRange: "8-12", fsaOverall: 76, rating: 7.4, classSize: 26, fciScore: 0.37, buildingCondition: "Fair", seismicRisk: "Upgrades Complete", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }, { name: "AP Courses", description: "Advanced Placement courses" }], principal: "Jennifer Kwon", email: "moscrop@burnabyschools.ca", phone: "604-296-6885", tags: ["strong-academics", "Metrotown-area"] },

  // === RICHMOND (District 38) ===
  { id: "ri-dixon", name: "Dixon Elementary", address: "5811 Woodwards Rd, Richmond, BC V7E 1H1", location: { latitude: 49.1720, longitude: -123.1320 }, category: "Elementary", district: "Richmond", districtNumber: 38, schoolType: "Public", enrollment: 360, capacity: 390, utilizationRate: 92, availableSeats: 30, gradeRange: "K-7", fsaOverall: 78, rating: 7.6, classSize: 23, fciScore: 0.33, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Christine Lo", email: "dixon@sd38.bc.ca", phone: "604-668-6238", tags: ["high-enrollment", "Steveston"] },

  { id: "ri-steveston-london", name: "Steveston-London Secondary", address: "6600 Williams Rd, Richmond, BC V7E 1K5", location: { latitude: 49.1740, longitude: -123.1790 }, category: "Secondary", district: "Richmond", districtNumber: 38, schoolType: "Public", enrollment: 1200, capacity: 1300, utilizationRate: 92, availableSeats: 100, gradeRange: "8-12", fsaOverall: 77, rating: 7.5, classSize: 25, fciScore: 0.30, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }, { name: "Arts Programs", description: "Strong visual and performing arts" }], principal: "Mark Anderson", email: "stevestonlondon@sd38.bc.ca", phone: "604-668-6615", tags: ["strong-arts", "Steveston"] },

  { id: "ri-palmer", name: "R.C. Palmer Secondary", address: "8160 St Albans Rd, Richmond, BC V6Y 2K5", location: { latitude: 49.1590, longitude: -123.1500 }, category: "Secondary", district: "Richmond", districtNumber: 38, schoolType: "Public", enrollment: 900, capacity: 1000, utilizationRate: 90, availableSeats: 100, gradeRange: "8-12", fsaOverall: 79, rating: 7.8, classSize: 24, fciScore: 0.35, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }, { name: "French Immersion", description: "French Immersion track" }], principal: "Diane Tao", email: "rcpalmer@sd38.bc.ca", phone: "604-668-6478", tags: ["academics", "Central-Richmond"] },

  { id: "ri-richmond-christian", name: "Richmond Christian School", address: "5240 Woodwards Rd, Richmond, BC V7E 1H1", location: { latitude: 49.1680, longitude: -123.1320 }, category: "Independent", district: "Richmond", districtNumber: 38, schoolType: "Independent", enrollment: 450, capacity: 500, utilizationRate: 90, availableSeats: 50, gradeRange: "K-12", fsaOverall: 82, rating: 8.1, classSize: 20, fciScore: 0.20, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Christian Education", description: "Faith-integrated curriculum with BC standards" }], principal: "Rev. Timothy Wu", email: "info@richmonddchristian.ca", phone: "604-272-1614", tags: ["faith-based", "independent"] },

  // === SURREY (District 36) ===
  { id: "su-semiahmoo", name: "Semiahmoo Secondary", address: "1785 148 St, Surrey, BC V4A 5P3", location: { latitude: 49.0590, longitude: -122.8010 }, category: "Secondary", district: "Surrey", districtNumber: 36, schoolType: "Public", enrollment: 1600, capacity: 1700, utilizationRate: 94, availableSeats: 100, gradeRange: "8-12", fsaOverall: 78, rating: 7.7, classSize: 26, fciScore: 0.40, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "IB Diploma Programme", description: "International Baccalaureate diploma" }, { name: "French Immersion", description: "French Immersion track" }], principal: "Gregory Fenton", email: "semiahmoo@surreyschools.ca", phone: "604-536-2131", tags: ["South-Surrey", "strong-athletics"] },

  { id: "su-southridge", name: "Southridge School", address: "2656 160 St, Surrey, BC V3Z 0B7", location: { latitude: 49.0320, longitude: -122.7730 }, category: "Independent", district: "Surrey", districtNumber: 36, schoolType: "Independent", enrollment: 650, capacity: 700, utilizationRate: 93, availableSeats: 50, gradeRange: "K-12", fsaOverall: 91, rating: 9.3, classSize: 17, fciScore: 0.07, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "IB Diploma Programme", description: "IB diploma for senior students" }, { name: "Outdoor Education", description: "Integrated outdoor and experiential learning" }], principal: "Drew Fagan", email: "admissions@southridge.bc.ca", phone: "604-535-5056", tags: ["elite-private", "top-ranked", "IB"] },

  { id: "su-fraser-heights", name: "Fraser Heights Secondary", address: "16060 108 Ave, Surrey, BC V4N 1G1", location: { latitude: 49.2030, longitude: -122.7530 }, category: "Secondary", district: "Surrey", districtNumber: 36, schoolType: "Public", enrollment: 1500, capacity: 1600, utilizationRate: 94, availableSeats: 100, gradeRange: "8-12", fsaOverall: 75, rating: 7.3, classSize: 27, fciScore: 0.38, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }, { name: "French Immersion", description: "French Immersion track" }], principal: "Pamela Ng", email: "fraserheights@surreyschools.ca", phone: "604-581-1131", tags: ["Fraser-Heights", "growing-community"] },

  { id: "su-panorama", name: "Panorama Ridge Secondary", address: "13220 64 Ave, Surrey, BC V3W 1Y5", location: { latitude: 49.1190, longitude: -122.8590 }, category: "Secondary", district: "Surrey", districtNumber: 36, schoolType: "Public", enrollment: 1700, capacity: 1800, utilizationRate: 94, availableSeats: 100, gradeRange: "8-12", fsaOverall: 73, rating: 7.1, classSize: 28, fciScore: 0.46, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }], principal: "Laura Kim", email: "panorama@surreyschools.ca", phone: "604-597-1049", tags: ["large-school", "diverse"] },

  { id: "su-elgin-park", name: "Elgin Park Secondary", address: "13484 24 Ave, Surrey, BC V4P 1L6", location: { latitude: 49.0370, longitude: -122.8570 }, category: "Secondary", district: "Surrey", districtNumber: 36, schoolType: "Public", enrollment: 1300, capacity: 1400, utilizationRate: 93, availableSeats: 100, gradeRange: "8-12", fsaOverall: 76, rating: 7.4, classSize: 26, fciScore: 0.42, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Andrew Foster", email: "elginpark@surreyschools.ca", phone: "604-535-9274", tags: ["White-Rock", "community"] },

  // === COQUITLAM (District 43) ===
  { id: "cq-glenayre", name: "Glenayre Elementary", address: "70 Bonnymuir Dr, Port Moody, BC V3H 3T2", location: { latitude: 49.2810, longitude: -122.8460 }, category: "Elementary", district: "Coquitlam", districtNumber: 43, schoolType: "Public", enrollment: 290, capacity: 320, utilizationRate: 91, availableSeats: 30, gradeRange: "K-5", fsaOverall: 77, rating: 7.5, classSize: 22, fciScore: 0.44, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Nancy Park", email: "glenayre@sd43.bc.ca", phone: "604-939-9214", tags: ["Port-Moody", "family-oriented"] },

  { id: "cq-centennial", name: "Centennial Secondary", address: "570 Poirier St, Coquitlam, BC V3J 6A9", location: { latitude: 49.2690, longitude: -122.8100 }, category: "Secondary", district: "Coquitlam", districtNumber: 43, schoolType: "Public", enrollment: 1200, capacity: 1300, utilizationRate: 92, availableSeats: 100, gradeRange: "8-12", fsaOverall: 76, rating: 7.4, classSize: 25, fciScore: 0.40, buildingCondition: "Fair", seismicRisk: "Upgrades Complete", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }, { name: "French Immersion", description: "French Immersion track" }], principal: "Derek Chang", email: "centennial@sd43.bc.ca", phone: "604-936-7205", tags: ["Coquitlam-Centre", "diverse"] },

  { id: "cq-gleneagle", name: "Gleneagle Secondary", address: "1195 Lansdowne Dr, Coquitlam, BC V3E 2P7", location: { latitude: 49.2890, longitude: -122.7940 }, category: "Secondary", district: "Coquitlam", districtNumber: 43, schoolType: "Public", enrollment: 1000, capacity: 1100, utilizationRate: 91, availableSeats: 100, gradeRange: "8-12", fsaOverall: 78, rating: 7.7, classSize: 24, fciScore: 0.28, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }, { name: "AP Courses", description: "Advanced Placement courses" }], principal: "Kimberly Sato", email: "gleneagle@sd43.bc.ca", phone: "604-464-5793", tags: ["Burke-Mountain", "growing"] },

  // === NEW WESTMINSTER (District 40) ===
  { id: "nw-qayqayt", name: "Qayqayt Elementary", address: "85 Merivale St, New Westminster, BC V3L 0K6", location: { latitude: 49.2040, longitude: -122.9110 }, category: "Elementary", district: "New Westminster", districtNumber: 40, schoolType: "Public", enrollment: 400, capacity: 420, utilizationRate: 95, availableSeats: 20, gradeRange: "K-5", fsaOverall: 76, rating: 7.4, classSize: 23, fciScore: 0.05, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Karen Singh", email: "qayqayt@sd40.bc.ca", phone: "604-517-6060", tags: ["new-school", "Queensborough"] },

  { id: "nw-new-west-sec", name: "New Westminster Secondary", address: "835 8th St, New Westminster, BC V3M 3S9", location: { latitude: 49.2130, longitude: -122.9110 }, category: "Secondary", district: "New Westminster", districtNumber: 40, schoolType: "Public", enrollment: 1800, capacity: 1900, utilizationRate: 95, availableSeats: 100, gradeRange: "8-12", fsaOverall: 73, rating: 7.1, classSize: 27, fciScore: 0.15, buildingCondition: "Good", seismicRisk: "Upgrades Complete", programs: [{ name: "IB Diploma Programme", description: "International Baccalaureate diploma" }, { name: "French Immersion", description: "French Immersion track" }], principal: "Michael Chin", email: "nwss@sd40.bc.ca", phone: "604-517-6220", tags: ["historic", "diverse", "large-school"] },

  // === DELTA (District 37) ===
  { id: "dl-south-delta", name: "South Delta Secondary", address: "4800 53 St, Delta, BC V4K 2Y8", location: { latitude: 49.0680, longitude: -123.0770 }, category: "Secondary", district: "Delta", districtNumber: 37, schoolType: "Public", enrollment: 1100, capacity: 1200, utilizationRate: 92, availableSeats: 100, gradeRange: "8-12", fsaOverall: 78, rating: 7.6, classSize: 25, fciScore: 0.34, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }, { name: "French Immersion", description: "French Immersion track" }], principal: "Robert Wilkinson", email: "southdelta@deltasd.bc.ca", phone: "604-946-4194", tags: ["Tsawwassen", "community"] },

  { id: "dl-south-park", name: "South Park Elementary", address: "5288 8 Ave, Delta, BC V4M 1S1", location: { latitude: 49.0690, longitude: -123.0770 }, category: "Elementary", district: "Delta", districtNumber: 37, schoolType: "Public", enrollment: 320, capacity: 350, utilizationRate: 91, availableSeats: 30, gradeRange: "K-7", fsaOverall: 79, rating: 7.8, classSize: 22, fciScore: 0.30, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Standard BC curriculum" }], principal: "Teresa Chan", email: "southpark@deltasd.bc.ca", phone: "604-946-4392", tags: ["Tsawwassen", "high-performing"] },

  // === LANGLEY (District 35) ===
  { id: "lg-langley-fine-arts", name: "Langley Fine Arts School", address: "9096 212 St, Langley, BC V1M 2N8", location: { latitude: 49.1630, longitude: -122.6680 }, category: "K-12", district: "Langley", districtNumber: 35, schoolType: "Public", enrollment: 600, capacity: 650, utilizationRate: 92, availableSeats: 50, gradeRange: "K-12", fsaOverall: 82, rating: 8.3, classSize: 21, fciScore: 0.27, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Fine Arts Focus", description: "Intensive visual arts, music, dance, drama and literary arts program" }], principal: "Carol Mitchell", email: "lfas@sd35.bc.ca", phone: "604-888-4411", tags: ["arts-focus", "K-12", "specialty"] },

  { id: "lg-brookswood", name: "Brookswood Secondary", address: "20902 37A Ave, Langley, BC V3A 4P4", location: { latitude: 49.1230, longitude: -122.6490 }, category: "Secondary", district: "Langley", districtNumber: 35, schoolType: "Public", enrollment: 1100, capacity: 1200, utilizationRate: 92, availableSeats: 100, gradeRange: "8-12", fsaOverall: 74, rating: 7.2, classSize: 26, fciScore: 0.41, buildingCondition: "Fair", seismicRisk: "Low", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }], principal: "Steven Harris", email: "brookswood@sd35.bc.ca", phone: "604-530-2141", tags: ["Brookswood", "suburban"] },

  // === MAPLE RIDGE (District 42) ===
  { id: "mr-garibaldi", name: "Garibaldi Secondary", address: "24789 Dewdney Trunk Rd, Maple Ridge, BC V2W 1C5", location: { latitude: 49.2280, longitude: -122.5890 }, category: "Secondary", district: "Maple Ridge", districtNumber: 42, schoolType: "Public", enrollment: 1100, capacity: 1200, utilizationRate: 92, availableSeats: 100, gradeRange: "8-12", fsaOverall: 72, rating: 7.0, classSize: 26, fciScore: 0.50, buildingCondition: "Fair", seismicRisk: "Medium", programs: [{ name: "Regular Program", description: "Comprehensive academic program" }], principal: "Daniel White", email: "garibaldi@sd42.ca", phone: "604-463-6287", tags: ["suburban", "community"] },

  // === PRIVATE / INDEPENDENT (Cross-district) ===
  { id: "pr-stgeorges", name: "St. George's School", address: "4175 W 29th Ave, Vancouver, BC V6S 1V1", location: { latitude: 49.2450, longitude: -123.1860 }, category: "Independent", district: "Vancouver", districtNumber: 39, schoolType: "Independent", enrollment: 1150, capacity: 1200, utilizationRate: 96, availableSeats: 50, gradeRange: "1-12", fsaOverall: 93, rating: 9.5, classSize: 17, fciScore: 0.09, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "AP Courses", description: "Extensive AP offerings" }, { name: "Enriched Academics", description: "University-preparatory curriculum" }], principal: "Tom Matthews", email: "admissions@stgeorges.bc.ca", phone: "604-224-1304", tags: ["elite-private", "boys-school", "top-ranked"] },

  { id: "pr-york-house", name: "York House School", address: "4176 Alexandra St, Vancouver, BC V6J 2V6", location: { latitude: 49.2480, longitude: -123.1600 }, category: "Independent", district: "Vancouver", districtNumber: 39, schoolType: "Independent", enrollment: 650, capacity: 680, utilizationRate: 96, availableSeats: 30, gradeRange: "K-12", fsaOverall: 92, rating: 9.4, classSize: 16, fciScore: 0.12, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "AP Courses", description: "Advanced Placement program" }, { name: "STEM Focus", description: "Dedicated STEM labs and curriculum" }], principal: "Chantal Gionet", email: "admissions@yorkhouse.ca", phone: "604-736-6551", tags: ["elite-private", "girls-school", "top-ranked"] },

  { id: "pr-crofton", name: "Crofton House School", address: "3200 W 41st Ave, Vancouver, BC V6N 3E1", location: { latitude: 49.2370, longitude: -123.1690 }, category: "Independent", district: "Vancouver", districtNumber: 39, schoolType: "Independent", enrollment: 800, capacity: 850, utilizationRate: 94, availableSeats: 50, gradeRange: "K-12", fsaOverall: 91, rating: 9.3, classSize: 17, fciScore: 0.11, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "AP Courses", description: "Advanced Placement offerings" }, { name: "Outdoor Education", description: "Integrated outdoor learning program" }], principal: "Patricia Fei", email: "admissions@croftonhouse.ca", phone: "604-263-3255", tags: ["elite-private", "girls-school", "top-ranked"] },

  { id: "pr-littleflower", name: "Little Flower Academy", address: "4195 Alexandra St, Vancouver, BC V6J 2V6", location: { latitude: 49.2470, longitude: -123.1600 }, category: "Independent", district: "Vancouver", districtNumber: 39, schoolType: "Independent", enrollment: 500, capacity: 550, utilizationRate: 91, availableSeats: 50, gradeRange: "8-12", fsaOverall: 88, rating: 8.9, classSize: 19, fciScore: 0.22, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Catholic Education", description: "Faith-integrated curriculum meeting BC standards" }, { name: "AP Courses", description: "Advanced Placement courses" }], principal: "Sr. Mary Catharine", email: "admissions@lfabc.org", phone: "604-738-9016", tags: ["Catholic", "girls-school"] },

  { id: "pr-vanalier", name: "Vancouver College", address: "5400 Cartier St, Vancouver, BC V6M 3A5", location: { latitude: 49.2310, longitude: -123.1390 }, category: "Independent", district: "Vancouver", districtNumber: 39, schoolType: "Independent", enrollment: 1000, capacity: 1050, utilizationRate: 95, availableSeats: 50, gradeRange: "K-12", fsaOverall: 84, rating: 8.5, classSize: 20, fciScore: 0.30, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "Catholic Education", description: "Christian Brothers tradition of education" }, { name: "AP Courses", description: "Advanced Placement courses" }], principal: "Kevin Carr", email: "admissions@vc.bc.ca", phone: "604-261-4285", tags: ["Catholic", "boys-school"] },

  { id: "pr-wpga", name: "West Point Grey Academy", address: "4125 W 8th Ave, Vancouver, BC V6R 4R3", location: { latitude: 49.2660, longitude: -123.2050 }, category: "Independent", district: "Vancouver", districtNumber: 39, schoolType: "Independent", enrollment: 900, capacity: 950, utilizationRate: 95, availableSeats: 50, gradeRange: "K-12", fsaOverall: 86, rating: 8.7, classSize: 18, fciScore: 0.15, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "IB Diploma Programme", description: "IB diploma for senior years" }, { name: "Outdoor Education", description: "Extensive outdoor program" }], principal: "Stephen Anthony", email: "admissions@wpga.ca", phone: "604-222-8750", tags: ["independent", "K-12", "Jericho"] },

  { id: "pr-meadowridge", name: "Meadowridge School", address: "12224 240 St, Maple Ridge, BC V4R 1N1", location: { latitude: 49.1830, longitude: -122.5490 }, category: "Independent", district: "Maple Ridge", districtNumber: 42, schoolType: "Independent", enrollment: 650, capacity: 700, utilizationRate: 93, availableSeats: 50, gradeRange: "K-12", fsaOverall: 89, rating: 9.0, classSize: 17, fciScore: 0.06, buildingCondition: "Good", seismicRisk: "Low", programs: [{ name: "IB Primary Years Programme", description: "IB PYP for elementary" }, { name: "IB Middle Years Programme", description: "IB MYP for middle school" }, { name: "IB Diploma Programme", description: "IB DP for senior years" }], principal: "Scott Rinn", email: "admissions@meadowridge.bc.ca", phone: "604-467-4444", tags: ["IB-world-school", "rural-campus"] },
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

export function getSeismicDistribution(districtNumber: number) {
  const schools = GVA_SCHOOLS.filter((s) => s.districtNumber === districtNumber && s.seismicRisk);
  const dist = { High: 0, Medium: 0, Low: 0, "Upgrades Complete": 0 };
  for (const s of schools) {
    if (s.seismicRisk) dist[s.seismicRisk]++;
  }
  return dist;
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
