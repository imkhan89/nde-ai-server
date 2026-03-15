import { getDatabase } from "./database.js";

/*
AI AUTO OPTIMIZATION ENGINE
Automatically improves search performance
and learns from user queries.
*/

let optimizationRunning = false;

export async function startAutoOptimizer() {

  if (optimizationRunning) {
    return;
  }

  optimizationRunning = true;

  setInterval(async () => {

    try {

      const db = await getDatabase();

      await optimizeIndexes(db);
      await cleanLearningLog(db);

    } catch (err) {

      console.error("AI Optimizer Error:", err);

    }

  }, 60000); // runs every 60 seconds

}

/*
CREATE PERFORMANCE INDEXES
*/

async function optimizeIndexes(db) {

  if (db.exec) {

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_make
      ON products(vehicle_make)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_model
      ON products(vehicle_model)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_year
      ON products(vehicle_year)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_brand
      ON products(brand)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_category
      ON products(category)
    `);

  } else {

    db.run(`CREATE INDEX IF NOT EXISTS idx_products_make ON products(vehicle_make)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_products_model ON products(vehicle_model)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_products_year ON products(vehicle_year)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);

  }

}

/*
AUTO CLEAN LEARNING DATA
Prevents database overload
*/

async function cleanLearningLog(db) {

  if (db.exec) {

    db.exec(`
      DELETE FROM learning_log
      WHERE id NOT IN (
        SELECT id FROM learning_log
        ORDER BY created_at DESC
        LIMIT 5000
      )
    `);

  } else {

    db.run(`
      DELETE FROM learning_log
      WHERE id NOT IN (
        SELECT id FROM learning_log
        ORDER BY created_at DESC
        LIMIT 5000
      )
    `);

  }

}

/*
AI QUERY LEARNING
Stores successful search queries
*/

export async function learnFromQuery(query, result) {

  try {

    const db = await getDatabase();

    if (db.exec) {

      const stmt = db.prepare(`
        INSERT INTO learning_log (query, result)
        VALUES (?, ?)
      `);

      stmt.run(query, JSON.stringify(result));

    } else {

      db.run(
        `INSERT INTO learning_log (query, result) VALUES (?, ?)`,
        [query, JSON.stringify(result)]
      );

    }

  } catch (err) {

    console.error("Learning Error:", err);

  }

}
