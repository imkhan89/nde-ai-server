require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");

/* =====================================================
SHOPIFY CONFIG
===================================================== */

const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION || "2024-10";

if (!SHOP || !TOKEN) {
  console.error("Missing Shopify credentials in environment variables");
  process.exit(1);
}

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

  console.log("Connecting to Shopify:", SHOP);

  try {

    while (url) {

      const res = await axios.get(url, {
        headers: {
          "X-Shopify-Access-Token": TOKEN
        }
      });

      const batch = res.data.products;

      products.push(...batch);

      console.log(`Fetched ${products.length} products`);

      /* Handle pagination */

      const link = res.headers.link;

      if (link && link.includes('rel="next"')) {

        const match = link.match(/<([^>]+)>; rel="next"/);
        url = match ? match[1] : null;

      } else {

        url = null;

      }

    }

  } catch (error) {

    console.error("Shopify API error:", error.message);
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

    const item = {

      id: p.id,
      title: p.title || "",
      handle: p.handle || "",
      vendor: p.vendor || "",
      product_type: p.product_type || "",
      tags: p.tags ? p.tags.split(",").map(t => t.trim()) : [],

      variants: (p.variants || []).map(v => ({
        id: v.id,
        sku: v.sku || "",
        price: v.price || "0",
        title: v.title || ""
      }))

    };

    PRODUCT_INDEX.push(item);

  }

  fs.writeFileSync(
    PRODUCT_INDEX_FILE,
    JSON.stringify(PRODUCT_INDEX, null, 2)
  );

  console.log("=================================");
  console.log("Product index built successfully");
  console.log("Products indexed:", PRODUCT_INDEX.length);
  console.log("Saved to:", PRODUCT_INDEX_FILE);
  console.log("=================================");

}

build();
