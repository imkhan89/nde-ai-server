import fetch from "node-fetch"

let PRODUCTS_CACHE = []

export async function syncShopifyProducts() {

  try {

    const SHOP = process.env.SHOPIFY_STORE
    const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

    if (!SHOP || !TOKEN) {
      console.log("Shopify credentials missing")
      return
    }

    const url = `https://${SHOP}/admin/api/2024-01/products.json?limit=250`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": TOKEN
      }
    })

    const data = await response.json()

    if (!data.products) {
      console.log("No products returned from Shopify")
      return
    }

    PRODUCTS_CACHE = data.products

    console.log(`Shopify Sync Complete: ${PRODUCTS_CACHE.length} products loaded`)

  } catch (error) {

    console.error("Shopify Sync Error:", error)

  }

}

export function getProducts() {
  return PRODUCTS_CACHE
}

export function searchProducts(query) {

  if (!query) return []

  const q = query.toLowerCase()

  return PRODUCTS_CACHE.filter(p =>
    p.title.toLowerCase().includes(q) ||
    (p.body_html && p.body_html.toLowerCase().includes(q))
  )

}
