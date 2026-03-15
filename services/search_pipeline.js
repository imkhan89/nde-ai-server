import { normalizeQuery } from "../query/query_normalizer.js";
import { parseQuery } from "../query/query_parser.js";
import { expandQuery } from "../query/smart_query_expander.js";

import { detectVehicle } from "../vehicle/vehicle_extractor.js";
import { detectParts } from "../parts/parts_intelligence.js";
import { detectBrand } from "../brand/brand_intelligence.js";

import { matchProducts } from "./product_matcher.js";
import { formatResults } from "./result_formatter.js";
import { logSearch } from "./search_logger.js";

export async function runSearchPipeline(userQuery) {
  if (!userQuery || typeof userQuery !== "string") {
    return [];
  }

  // Step 1 Normalize
  const normalized = normalizeQuery(userQuery);

  // Step 2 Parse
  const parsed = parseQuery(normalized);

  // Step 3 Expand
  const expanded = expandQuery(parsed);

  // Step 4 Detect Vehicle
  const vehicle = detectVehicle(expanded);

  // Step 5 Detect Parts
  const parts = detectParts(expanded);

  // Step 6 Detect Brand
  const brand = detectBrand(expanded);

  // Step 7 Product Matching
  const matchedProducts = await matchProducts({
    query: expanded,
    vehicle,
    parts,
    brand
  });

  // Step 8 Format Results
  const results = formatResults(matchedProducts);

  // Step 9 Log Search
  await logSearch({
    query: userQuery,
    normalized_query: normalized
  });

  return results;
}

export default {
  runSearchPipeline
};
