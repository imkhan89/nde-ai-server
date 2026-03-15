import { tokenizeQuery, cleanQuery } from "./query_normalizer.js";
import { detectVehicle } from "./vehicle_intelligence.js";
import { detectPart } from "./parts_intelligence.js";
import { detectBrand } from "./brand_intelligence.js";

/*
NDE Automotive AI
Query Parser

Converts raw user search query into structured automotive intent
Vehicle + Part + Brand + Clean Query
Self-optimizing structure for AI search engine
*/

export function parseQuery(query) {

  if (!query) {
    return {
      raw: "",
      cleaned: "",
      tokens: [],
      vehicle: { make: null, model: null, year: null },
      part: null,
      brand: null
    };
  }

  const cleaned = cleanQuery(query);

  const tokens = tokenizeQuery(query);

  const vehicle = detectVehicle(tokens);

  const part = detectPart(tokens);

  const brand = detectBrand(tokens);

  return {
    raw: query,
    cleaned,
    tokens,
    vehicle,
    part,
    brand
  };

}

/*
Query intent scoring
Helps AI rank search results
*/

export function scoreQueryIntent(parsed) {

  let score = 0;

  if (parsed.vehicle.make) score += 2;
  if (parsed.vehicle.model) score += 2;
  if (parsed.vehicle.year) score += 1;

  if (parsed.part) score += 3;

  if (parsed.brand) score += 2;

  return score;

}
