import db from "../database/database.js";

function groupByVendor(products) {
  const map = {};

  for (const p of products) {
    const vendor = (p.vendor || "unknown").toLowerCase();

    if (!map[vendor]) {
      map[vendor] = 0;
    }

    map[vendor] += 1;
  }

  return map;
}

function groupByProductType(products) {
  const map = {};

  for (const p of products) {
    const type = (p.product_type || "unknown").toLowerCase();

    if (!map[type]) {
      map[type] = 0;
    }

    map[type] += 1;
  }

  return map;
}

export function predictInventoryDemand() {
  const stmt = db.prepare(`
    SELECT vendor, product_type
    FROM products
  `);

  const products = stmt.all();

  const vendorDemand = groupByVendor(products);
  const typeDemand = groupByProductType(products);

  return {
    vendorDemand,
    typeDemand,
    analyzedProducts: products.length
  };
}

export default {
  predictInventoryDemand
};
