import { getDatabase } from "../database/database.js";

/*
NDE Automotive AI
Product Matcher Engine

Matches parsed query with products in database
Auto-optimizes results and learns from queries
*/

export async function matchProducts(parsedQuery) {

  const db = await getDatabase();

  const { vehicle, part, brand } = parsedQuery;

  let conditions = [];
  let params = [];

  if (vehicle.make) {
    conditions.push("vehicle_make = ?");
    params.push(vehicle.make);
  }

  if (vehicle.model) {
    conditions.push("vehicle_model = ?");
    params.push(vehicle.model);
  }

  if (vehicle.year) {
    conditions.push("vehicle_year = ?");
    params.push(vehicle.year);
  }

  if (brand) {
    conditions.push("brand = ?");
    params.push(brand);
  }

  if (part) {
    conditions.push("category LIKE ?");
    params.push(`%${part}%`);
  }

  let whereClause = "";

  if (conditions.length > 0) {
    whereClause = "WHERE " + conditions.join(" AND ");
  }

  const sql = `
    SELECT *
    FROM products
    ${whereClause}
    LIMIT 50
  `;

  if (db.prepare) {

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);

    return rows;

  } else {

    return new Promise((resolve, reject) => {

      db.all(sql, params, (err, rows) => {

        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }

      });

    });

  }

}

/*
AI Assisted Ranking
Ranks products based on relevance
*/

export function rankProducts(products, parsedQuery) {

  if (!products || products.length === 0) {
    return [];
  }

  const { vehicle, part, brand } = parsedQuery;

  return products
    .map(product => {

      let score = 0;

      if (vehicle.make && product.vehicle_make === vehicle.make) score += 3;
      if (vehicle.model && product.vehicle_model === vehicle.model) score += 3;
      if (vehicle.year && product.vehicle_year === vehicle.year) score += 2;

      if (brand && product.brand === brand) score += 2;

      if (part && product.category && product.category.includes(part)) score += 3;

      return {
        ...product,
        score
      };

    })
    .sort((a, b) => b.score - a.score);

}
