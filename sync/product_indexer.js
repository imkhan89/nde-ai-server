import db from "../database/database.js";

function insertProduct(product) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO products
    (id, title, handle, vendor, product_type, price, sku, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    product.id,
    product.title,
    product.handle,
    product.vendor,
    product.product_type,
    product.price,
    product.sku,
    product.tags,
    product.created_at,
    product.updated_at
  );
}

export function indexProduct(product) {
  insertProduct(product);
}

export function indexProducts(products = []) {
  const trx = db.transaction((items) => {
    for (const product of items) {
      insertProduct(product);
    }
  });

  trx(products);
}

export default {
  indexProduct,
  indexProducts
};
