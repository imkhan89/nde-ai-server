// sync/shopify_sync.js

import fetch from "node-fetch";

export async function syncShopifyProducts(db) {

    const store = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_ADMIN_API_TOKEN;

    const url = `https://${store}/admin/api/2024-01/products.json?limit=250`;

    try {

        const response = await fetch(url, {
            headers: {
                "X-Shopify-Access-Token": token,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!data.products) {
            console.log("No products returned from Shopify");
            return;
        }

        for (const product of data.products) {

            const id = product.id;
            const title = product.title;
            const handle = product.handle;

            await db.run(
                `
                INSERT OR REPLACE INTO products (id, title, handle)
                VALUES (?, ?, ?)
                `,
                [id, title, handle]
            );

        }

        console.log(`Synced ${data.products.length} products`);

        // Update FTS index
        await db.exec(`
            INSERT INTO products_fts(rowid, title, handle)
            SELECT id, title, handle FROM products
            WHERE id NOT IN (SELECT rowid FROM products_fts)
        `);

        console.log("FTS index updated");

    } catch (error) {

        console.error("Shopify sync error:", error);

    }

}
