const axios = require("axios");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION;

let productCache = [];

async function fetchProducts() {

    try {

        console.log("Fetching Shopify catalog...");

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
            handle: p.handle
        }));

        console.log("Products Synced:", productCache.length);

    } catch (err) {

        console.error("Shopify Sync Error:", err.message);

    }

}

function searchProducts(query) {

    if (!query) return [];

    query = query.toLowerCase();

    return productCache
        .filter(p => p.title.toLowerCase().includes(query))
        .slice(0,5);

}

async function startCatalogSync() {

    await fetchProducts();

    setInterval(fetchProducts, 1800000);

}

module.exports = {
    startCatalogSync,
    searchProducts
};
