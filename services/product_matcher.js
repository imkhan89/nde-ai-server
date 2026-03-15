import db from "../database/database.js";

function buildSearchConditions({ query, parts, brand }) {
  const conditions = [];
  const params = [];

  if (query) {
    conditions.push("(title LIKE ? OR tags LIKE ?)");
    params.push(`%${query}%`, `%${query}%`);
  }

  if (parts && parts.length) {
    const partConditions = parts.map(() => "(title LIKE ? OR tags LIKE ?)").join(" OR ");
    conditions.push(`(${partConditions})`);
    parts.forEach((p) => {
      params.push(`%${p}%`, `%${p}%`);
    });
  }

  if (brand) {
    conditions.push("vendor LIKE ?");
    params.push(`%${brand}%`);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params
  };
}

export async function matchProducts({ query, parts, brand }) {
  const { where, params } = buildSearchConditions({ query, parts, brand });

  const sql = `
    SELECT
      id,
      title,
      handle,
      vendor,
      product_type,
      price,
      sku,
      tags
    FROM products
    ${where}
    LIMIT 50
  `;

  const stmt = db.prepare(sql);
  const rows = stmt.all(params);

  return rows;
}

export default {
  matchProducts
};
