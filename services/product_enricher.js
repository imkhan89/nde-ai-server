import { extractVehicleFromTitle } from "./vehicle_extractor.js";
import { learnCompatibility } from "./compatibility_engine.js";
import { connect } from "./knowledge_graph.js";

/*
NDE Automotive AI
Product Enricher

Automatically enriches product data before indexing.
Extracts vehicle information and builds knowledge graph relations.
*/

export function enrichProduct(product) {

  if (!product) return null;

  const title = product.title || "";

  const vehicle = extractVehicleFromTitle(title);

  const enriched = {
    ...product,
    vehicle_make: product.vehicle_make || vehicle.make || null,
    vehicle_model: product.vehicle_model || vehicle.model || null,
    vehicle_year: product.vehicle_year || vehicle.year || null
  };

  /*
  Teach compatibility engine
  */

  learnCompatibility(enriched);

  /*
  Build knowledge graph relation
  */

  if (enriched.vehicle_make && enriched.vehicle_model && enriched.category) {

    connect(
      enriched.vehicle_make,
      enriched.vehicle_model,
      enriched.category,
      enriched.brand
    );

  }

  return enriched;

}

/*
Batch enrichment
*/

export function enrichProducts(products = []) {

  if (!Array.isArray(products)) {
    return [];
  }

  const enriched = [];

  for (const p of products) {

    const e = enrichProduct(p);

    if (e) {
      enriched.push(e);
    }

  }

  return enriched;

}
