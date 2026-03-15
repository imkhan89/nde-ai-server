import { addRelation } from "./knowledge_graph.js";

function extractVehicle(tags = "") {
  const tagList = tags.toLowerCase().split(",").map(t => t.trim());

  let make = null;
  let model = null;
  let year = null;

  for (const tag of tagList) {
    if (/^(19|20)\d{2}$/.test(tag)) {
      year = parseInt(tag);
    }

    if (["toyota","honda","suzuki","nissan","mitsubishi","kia","hyundai"].includes(tag)) {
      make = tag;
    }

    if (
      [
        "corolla","civic","city","alto","cultus","wagonr",
        "mehran","vitz","yaris","sportage","elantra"
      ].includes(tag)
    ) {
      model = tag;
    }
  }

  return { make, model, year };
}

function extractPart(tags = "") {
  const tagList = tags.toLowerCase();

  const parts = [
    "brake pad",
    "brake pads",
    "air filter",
    "oil filter",
    "cabin filter",
    "spark plug",
    "wiper blade",
    "radiator cap",
    "horn",
    "bumper"
  ];

  for (const part of parts) {
    if (tagList.includes(part)) {
      return part;
    }
  }

  return null;
}

function extractBrand(vendor = "") {
  if (!vendor) return null;

  return vendor.toLowerCase();
}

export function buildGraphFromProduct(product) {
  const vehicle = extractVehicle(product.tags || "");
  const part = extractPart(product.tags || "");
  const brand = extractBrand(product.vendor || "");

  if (!vehicle.make || !vehicle.model || !part) {
    return;
  }

  addRelation({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    part,
    brand
  });
}

export default {
  buildGraphFromProduct
};
