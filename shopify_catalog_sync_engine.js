const axios = require("axios");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION;

let productCache = [];

async function fetchAllProducts() {

    try {

        console.log("Starting Shopify full catalog sync...");

        let since_id = 0;
        let allProducts = [];
        let keepFetching = true;

        while (keepFetching) {

            const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=250&since_id=${since_id}`;

            const response = await axios.get(url, {
                headers: {
                    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                    "Content-Type": "application/json"
                }
            });

            const products = response.data.products || [];

            console.log(`Fetched ${products.length} products`);

            if (products.length === 0) {
                keepFetching = false;
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

            since_id = products[products.length - 1].id;

            if (products.length < 250) {
                keepFetching = false;
            }

        }

        productCache = allProducts;

        console.log("Full Shopify Catalog Loaded:", productCache.length);

    } catch (error) {

        console.error("Shopify Sync Error:", error.response?.data || error.message);

    }

}

function searchProducts(query) {

    if (!query) return [];

    query = query.toLowerCase();

    return productCache
        .filter(p => p.title.toLowerCase().includes(query))
        .slice(0, 10);

}

function getProductCount() {

    return productCache.length;

}

async function startCatalogSync() {

    await fetchAllProducts();

    console.log("Shopify Catalog Sync Engine Started");

    setInterval(fetchAllProducts, 30 * 60 * 1000);

}

module.exports = {
    startCatalogSync,
    searchProducts,
    getProductCount
};
