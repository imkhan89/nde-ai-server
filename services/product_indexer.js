import { getDatabase } from "../database/database.js";

/*
NDE Automotive AI
Product Indexer

Automatically indexes products into the AI database
and keeps the search engine optimized.
*/

export async function indexProducts(products = []) {

  if (!Array.isArray(products) || products.length === 0) {
    return;
  }

  const db = await getDatabase();

  if (db.prepare) {

    const insert = db.prepare(`
      INSERT INTO products
      (title, sku, brand, vehicle_make, vehicle_model, vehicle_year, category, price, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((items) => {

      for (const product of items) {

        insert.run(
          product.title || "",
          product.sku || "",
          product.brand || "",
          product.vehicle_make || "",
          product.vehicle_model || "",
          product.vehicle_year || "",
          product.category || "",
          product.price || 0,
          JSON.stringify(product)
        );

      }

    });

    transaction(products);

  } else {

    for (const product of products) {

      await new Promise((resolve, reject) => {

        db.run(
          `
          INSERT INTO products
          (title, sku, brand, vehicle_make, vehicle_model, vehicle_year, category, price, data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            product.title || "",
            product.sku || "",
            product.brand || "",
            product.vehicle_make || "",
            product.vehicle_model || "",
            product.vehicle_year || "",
            product.category || "",
            product.price || 0,
            JSON.stringify(product)
          ],
          (err) => {

            if (err) reject(err);
            else resolve();

          }
        );

      });

    }

  }

}

/*
Clear index (used during AI re-training)
*/

export async function clearProductIndex() {

  const db = await getDatabase();

  if (db.exec) {

    db.exec(`DELETE FROM products`);

  } else {

    await new Promise((resolve, reject) => {

      db.run(`DELETE FROM products`, (err) => {

        if (err) reject(err);
        else resolve();

      });

    });

  }

}
