const fs = require("fs");
const path = require("path");

const fuzzyMatchPart = require("./fuzzy_parts_engine");

const vehicles = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data", "vehicle_graph.json"),
    "utf8"
  )
);

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectVehicle(query) {

  const q = normalize(query);

  for (const vehicle of vehicles) {

    const brand = vehicle.brand.toLowerCase();
    const model = vehicle.model.toLowerCase();

    if (q.includes(brand) && q.includes(model)) {
      return vehicle;
    }

    if (q.includes(model)) {
      return vehicle;
    }

  }

  return null;
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
