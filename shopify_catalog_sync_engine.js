// shopify_catalog_sync_engine.js

const axios = require("axios");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION;

let productCache = [];

async function fetchShopifyProducts() {

    try {

        console.log("Fetching Shopify products...");

        const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=250`;

        const response = await axios.get(url, {
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                "Content-Type": "application/json"
            }
        });

        const products = response.data.products || [];

        productCache = products.map(p => ({
            id: p.id,
            title: p.title,
            handle: p.handle,
            vendor: p.vendor,
            product_type: p.product_type
        }));

        console.log("Shopify products synced:", productCache.length);

    } catch (error) {

        console.error("Shopify Sync Error:", error.message);

    }

}

function searchProducts(query) {

    if (!query) return [];

    query = query.toLowerCase();

    return productCache
        .filter(p => p.title.toLowerCase().includes(query))
        .slice(0, 5);

}

async function startCatalogSync() {

    console.log("Starting Shopify Catalog Sync...");

    await fetchShopifyProducts();

    setInterval(fetchShopifyProducts, 30 * 60 * 1000);

}

module.exports = {
    startCatalogSync,
    searchProducts
};
