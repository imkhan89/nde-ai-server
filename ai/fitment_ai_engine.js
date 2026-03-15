import { detectVehicle } from "../vehicle/vehicle_intelligence.js";
import { detectParts } from "../parts/parts_intelligence.js";
import { findCompatibleParts } from "../knowledge/compatibility_engine.js";

export function analyzeFitment(query = "") {
  const vehicle = detectVehicle(query);
  const parts = detectParts(query);

  return {
    vehicle,
    parts
  };
}

export function getFitmentResults(query) {
  const analysis = analyzeFitment(query);

  if (!analysis.vehicle.make || !analysis.vehicle.model) {
    return {
      analysis,
      compatibleParts: []
    };
  }

  const results = findCompatibleParts(
    analysis.vehicle.make,
    analysis.vehicle.model,
    analysis.vehicle.year
  );

  return {
    analysis,
    compatibleParts: results
  };
}

export default {
  analyzeFitment,
  getFitmentResults
};
