const detectVehicle = require("./vehicle_detection_engine");
const fuzzyMatchPart = require("./fuzzy_parts_engine");

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractYear(query) {

  const match = query.match(/\b(19|20)\d{2}\b/);

  if (!match) return null;

  return match[0];
}

function automotiveAI(query) {

  if (!query || typeof query !== "string") {
    return null;
  }

  const clean = normalize(query);

  const vehicle = detectVehicle(clean);

  const part = fuzzyMatchPart(clean);

  const year = extractYear(clean);

  return {
    vehicle,
    part,
    year
  };
}

module.exports = automotiveAI;
