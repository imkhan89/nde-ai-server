import fetch from "node-fetch";
import { setCachedProducts } from "../services/shopify_cache.js";

let productCache = [];

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

export async function syncShopifyProducts() {

    try {

        console.log("Starting Shopify product sync...");

        let allProducts = [];
        let hasNextPage = true;
        let cursor = null;

        while (hasNextPage) {

            let url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`;

            if (cursor) {
                url += `&page_info=${cursor}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-Shopify-Access-Token": SHOPIFY_TOKEN,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (data.products) {
                allProducts = allProducts.concat(data.products);
            }

            const linkHeader = response.headers.get("link");

            if (linkHeader && linkHeader.includes('rel="next"')) {

                const match = linkHeader.match(/page_info=([^&>]+)/);

                if (match) {
                    cursor = match[1];
                }

            } else {
                hasNextPage = false;
            }

        }

        productCache = allProducts;

        setCachedProducts(allProducts);

        console.log(`Shopify Sync Complete: ${productCache.length} products loaded`);

        return productCache;

    } catch (error) {

        console.error("Shopify Sync Error:", error);

        return [];

    }

}


export function getCachedProducts() {
    return productCache;
}
