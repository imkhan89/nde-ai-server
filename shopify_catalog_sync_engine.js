const axios = require("axios");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION;

let productCache = [];

async function fetchAllProducts() {

    try {

        console.log("Starting Shopify full catalog sync...");

        let page = 1;
        let hasMore = true;
        let allProducts = [];

        while (hasMore) {

            const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=250&page=${page}`;

            const response = await axios.get(url, {
                headers: {
                    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                    "Content-Type": "application/json"
                }
            });

            const products = response.data.products || [];

            console.log(`Fetched page ${page} : ${products.length} products`);

            if (products.length === 0) {
                hasMore = false;
                break;
            }

            const mapped = products.map(p => ({
                id: p.id,
                title: p.title,
                handle: p.handle,
                vendor: p.vendor,
                product_type: p.product_type
            }));

            allProducts = [...allProducts, ...mapped];

            if (products.length < 250) {
                hasMore = false;
            } else {
                page++;
            }

        }

        productCache = allProducts;

        console.log("Full Shopify Catalog Loaded:", productCache.length);

    } catch (error) {

        console.error("Shopify Sync Error:", error.message);

    }

}

function searchProducts(query) {

    if (!query) return [];

    query = query.toLowerCase();

    return productCache
        .filter(p => p.title.toLowerCase().includes(query))
        .slice(0, 10);

}

async function startCatalogSync() {

    await fetchAllProducts();

    // refresh catalog every 30 minutes
    setInterval(fetchAllProducts, 30 * 60 * 1000);

}

module.exports = {
    startCatalogSync,
    searchProducts
};
