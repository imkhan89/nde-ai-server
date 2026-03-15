import db from "../database/database.js";

export function getTopBrands(limit = 10) {
  const stmt = db.prepare(`
    SELECT vendor AS brand, COUNT(*) AS count
    FROM products
    GROUP BY vendor
    ORDER BY count DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export function getBrandsForPart(partName) {
  const stmt = db.prepare(`
    SELECT DISTINCT vendor AS brand
    FROM products
    WHERE tags LIKE ?
  `);

  return stmt.all(`%${partName}%`);
}

export default {
  getTopBrands,
  getBrandsForPart
};
