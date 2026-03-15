import { buildGraphFromProduct } from "../knowledge/graph_builder.js";

function normalizeTags(tags = "") {
  if (!tags) return [];

  if (Array.isArray(tags)) return tags;

  return tags
    .split(",")
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);
}

function extractVehicleHints(tags = []) {
  const makes = ["toyota","honda","suzuki","nissan","mitsubishi","kia","hyundai","daihatsu"];
  const models = [
    "corolla","yaris","vitz","civic","city","alto",
    "cultus","wagonr","mehran","swift","sportage","elantra"
  ];

  let make = null;
  let model = null;
  let year = null;

  for (const tag of tags) {
    if (makes.includes(tag)) make = tag;
    if (models.includes(tag)) model = tag;

    if (/^(19|20)\d{2}$/.test(tag)) {
      year = parseInt(tag);
    }
  }

  return { make, model, year };
}

function enrichProduct(product) {
  const tags = normalizeTags(product.tags);

  const vehicle = extractVehicleHints(tags);

  return {
    ...product,
    vehicle_make: vehicle.make,
    vehicle_model: vehicle.model,
    vehicle_year: vehicle.year
  };
}

export function enrichProducts(products = []) {
  const enriched = [];

  for (const product of products) {
    const p = enrichProduct(product);

    enriched.push(p);

    // build compatibility graph automatically
    try {
      buildGraphFromProduct(p);
    } catch (err) {
      console.error("Graph build failed:", err);
    }
  }

  return enriched;
}

export default {
  enrichProducts
};
