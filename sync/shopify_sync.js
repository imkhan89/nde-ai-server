import fetch from "node-fetch"
import { setCachedProducts } from "../services/shopify_cache.js"

let productCache = []

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN?.replace("https://", "")
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01"

export async function syncShopifyProducts() {

    try {

        console.log("Starting Shopify product sync...")

        if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {

            console.log("Shopify credentials missing")

            return []

        }

        let allProducts = []
        let url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=250`

        while (url) {

            const response = await fetch(url, {

                method: "GET",
                headers: {
                    "X-Shopify-Access-Token": SHOPIFY_TOKEN,
                    "Content-Type": "application/json"
                }

            })

            const data = await response.json()

            if (!data.products) {

                console.log("Shopify API response:", JSON.stringify(data, null, 2))

                break

            }

            allProducts = allProducts.concat(data.products)

            const linkHeader = response.headers.get("link")

            if (linkHeader && linkHeader.includes('rel="next"')) {

                const match = linkHeader.match(/<([^>]+)>; rel="next"/)

                url = match ? match[1] : null

            } else {

                url = null

            }

        }

        const products = allProducts.map(product => ({

            id: product.id,
            title: product.title,
            handle: product.handle,
            price: product.variants?.[0]?.price || null

        }))

        productCache = products

        setCachedProducts(products)

        console.log(`Shopify Sync Complete: ${products.length} products loaded`)

        return products

    } catch (error) {

        console.error("Shopify Sync Error:", error)

        return []

    }

}

export function getCachedProducts() {
    return productCache
}
