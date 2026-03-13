const axios = require("axios");
const fs = require("fs");
const path = require("path");

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

const DATA_DIR = path.join(__dirname, "../data");

const PRODUCTS_FILE = path.join(DATA_DIR, "shopify_products.json");
const PRODUCT_INDEX_FILE = path.join(DATA_DIR, "product_index.json");

async function fetchAllProducts() {

    console.log("Starting Shopify catalog sync...");

    let products = [];
    let pageInfo = null;

    while (true) {

        let url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json?limit=250`;

        if (pageInfo) {
            url += `&page_info=${pageInfo}`;
        }

        const response = await axios.get(url, {
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_TOKEN,
                "Content-Type": "application/json"
            }
        });

        const data = response.data.products;

        if (!data || data.length === 0) break;

        products = products.concat(data);

        console.log("Downloaded products:", products.length);

        const linkHeader = response.headers.link;

        if (!linkHeader || !linkHeader.includes("rel=\"next\"")) {
            break;
        }

        const match = linkHeader.match(/page_info=([^&>]+)/);

        if (!match) break;

        pageInfo = match[1];
    }

    console.log("Total products downloaded:", products.length);

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    return products;
}

function buildProductIndex(products) {

    console.log("Building fast product index...");

    const index = [];

    products.forEach(product => {

        const title = product.title.toLowerCase();

        const handle = product.handle;

        const tags = product.tags ? product.tags.toLowerCase() : "";

        const vendor = product.vendor ? product.vendor.toLowerCase() : "";

        index.push({
            id: product.id,
            title,
            handle,
            tags,
            vendor,
            url: `https://ndestore.com/products/${handle}`
        });

    });

    fs.writeFileSync(PRODUCT_INDEX_FILE, JSON.stringify(index, null, 2));

    console.log("Product index built:", index.length);
}

async function syncShopifyCatalog() {

    try {

        const products = await fetchAllProducts();

        buildProductIndex(products);

        console.log("Shopify catalog sync complete");

    } catch (err) {

        console.error("Catalog sync error:", err.message);

    }
}

module.exports = {
    syncShopifyCatalog
};
