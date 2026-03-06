require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");

/* =====================================================
SHOPIFY CONFIG
===================================================== */

const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION || "2024-10";

/* =====================================================
PATHS
===================================================== */

const ROOT = __dirname;
const INDEX_DIR = path.join(ROOT, "index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR, "product_index.json");

if (!fs.existsSync(INDEX_DIR)) {
    fs.mkdirSync(INDEX_DIR, { recursive: true });
}

/* =====================================================
FETCH PRODUCTS FROM SHOPIFY
===================================================== */

async function fetchProducts() {

    let products = [];
    let url = `https://${SHOP}/admin/api/${VERSION}/products.json?limit=250`;

    try {

        while (url) {

            const res = await axios.get(url, {
                headers: {
                    "X-Shopify-Access-Token": TOKEN
                }
            });

            products.push(...res.data.products);

            console.log(`Fetched ${products.length} products`);

            const link = res.headers.link;

            if (link && link.includes('rel="next"')) {

                const match = link.match(/<([^>]+)>; rel="next"/);

                url = match ? match[1] : null;

            } else {

                url = null;

            }

        }

    } catch (e) {

        console.error("Shopify API error:", e.message);
        process.exit(1);

    }

    return products;

}

/* =====================================================
BUILD PRODUCT INDEX
===================================================== */

async function build() {

    console.log("Fetching Shopify products...");

    const products = await fetchProducts();

    const PRODUCT_INDEX = [];

    for (const p of products) {

        const payload = {

            id: p.id,
            title: p.title || "",
            handle: p.handle || "",
            vendor: p.vendor || "",
            type: p.product_type || "",
            tags: p.tags ? p.tags.split(",") : [],
            variants: p.variants.map(v => ({
                id: v.id,
                price: v.price,
                sku: v.sku
            }))

        };

        PRODUCT_INDEX.push(payload);

    }

    fs.writeFileSync(
        PRODUCT_INDEX_FILE,
        JSON.stringify(PRODUCT_INDEX, null, 2)
    );

    console.log("Product index built successfully.");
    console.log("Products indexed:", PRODUCT_INDEX.length);
    console.log("Index file:", PRODUCT_INDEX_FILE);

}

build();
