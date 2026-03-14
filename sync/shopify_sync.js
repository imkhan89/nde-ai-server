import db from "../database/database.js"

const SHOPIFY_STORE =
  process.env.SHOPIFY_STORE ||
  process.env.SHOPIFY_STORE_DOMAIN

const SHOPIFY_TOKEN =
  process.env.SHOPIFY_ADMIN_API_TOKEN ||
  process.env.SHOPIFY_ACCESS_TOKEN ||
  process.env.SHOPIFY_TOKEN

console.log("Shopify Store:", SHOPIFY_STORE)
console.log("Shopify Token Loaded:", SHOPIFY_TOKEN ? "YES" : "NO")
