import { getDatabase } from "../database/database.js";
import { connect } from "./knowledge_graph.js";

/*
NDE Automotive AI
Knowledge Graph Builder

Builds relationships between vehicles, parts, and brands
using the indexed product database.
*/

export async function buildKnowledgeGraph() {

  const db = await getDatabase();

  let products = [];

  if (db.prepare) {

    const stmt = db.prepare(`
      SELECT vehicle_make, vehicle_model, category, brand
      FROM products
    `);

    products = stmt.all();

  } else {

    products = await new Promise((resolve, reject) => {

      db.all(
        `SELECT vehicle_make, vehicle_model, category, brand FROM products`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );

    });

  }

  for (const p of products) {

    if (!p.vehicle_make || !p.vehicle_model || !p.category) {
      continue;
    }

    connect(
      p.vehicle_make,
      p.vehicle_model,
      p.category,
      p.brand
    );

  }

}

/*
Incremental learning
*/

export async function learnProductRelation(product) {

  if (!product) return;

  connect(
    product.vehicle_make,
    product.vehicle_model,
    product.category,
    product.brand
  );

}
