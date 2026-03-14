import db from "../database/database.js"

const SHOPIFY_STORE = process.env.SHOPIFY_STORE
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN

export async function syncShopifyProducts() {

  let total = 0
  let url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`

  while (url) {

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
        "Content-Type": "application/json"
      }
    })

    const data = await response.json()

    if (!data.products) break

    for (const product of data.products) {

      db.run(
        `INSERT OR REPLACE INTO products (id, title, handle)
         VALUES (?, ?, ?)`,
        [
          product.id,
          product.title,
          product.handle
        ]
      )

      total++

    }

    const linkHeader = response.headers.get("link")

    if (linkHeader && linkHeader.includes('rel="next"')) {

      const match = linkHeader.match(/<([^>]+)>; rel="next"/)

      if (match) {
        url = match[1]
      } else {
        url = null
      }

    } else {
      url = null
    }

  }

  return total
}
