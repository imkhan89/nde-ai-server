import { detectVehicle } from "../vehicle/vehicle_intelligence.js";
import { detectParts } from "../parts/parts_intelligence.js";
import { detectBrand } from "../brand/brand_intelligence.js";
import { semanticSearch } from "./vector_search_engine.js";

export function analyzeSearchQuery(query = "") {
  const vehicle = detectVehicle(query);
  const parts = detectParts(query);
  const brand = detectBrand(query);

  return {
    query,
    vehicle,
    parts,
    brand
  };
}

export function intelligentSearch(query) {
  const analysis = analyzeSearchQuery(query);

  const results = semanticSearch(query);

  return {
    analysis,
    results
  };
}

export default {
  analyzeSearchQuery,
  intelligentSearch
};
