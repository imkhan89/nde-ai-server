import { detectVehicle } from "./vehicle_intelligence.js";

function normalizeText(text = "") {
  return text.toLowerCase().trim();
}

export function extractVehicle(query = "") {
  const cleanQuery = normalizeText(query);

  const vehicle = detectVehicle(cleanQuery);

  return {
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year
  };
}

export function hasVehicle(query = "") {
  const vehicle = extractVehicle(query);

  return Boolean(vehicle.make || vehicle.model || vehicle.year);
}

export default {
  extractVehicle,
  hasVehicle
};
