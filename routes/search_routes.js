import axios from "axios";
import { trainAI } from "../ai/learning_engine.js";
import { aiSearch } from "../ai/search_engine.js";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

// ✅ CACHE
let CACHE = [];
let LAST = 0;

async function fetchProducts() {
  const now = Date.now();

  if (CACHE.length && now - LAST < 600000) {
    return CACHE;
  }

  const res = await axios.get(
    `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=100`,
    {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      },
    }
  );

  CACHE = res.data.products || [];
  LAST = now;

  // ✅ TRAIN AI EVERY FETCH
  trainAI(CACHE);

  return CACHE;
}

// ✅ MAIN SEARCH
export async function searchProducts(query) {
  try {
    await fetchProducts();

    return aiSearch(query);
  } catch (error) {
    console.error("Search error:", error.message);
    return [];
  }
}
