import fetch from "node-fetch"
import { setCachedProducts } from "../services/shopify_cache.js"

let productCache = []

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01"

export async function syncShopifyProducts() {

    try {

        console.log("Starting Shopify product sync...")

        const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=50`

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
            return []
        }

        const products = data.products.map(product => {

            return {
                id: product.id,
                title: product.title,
                handle: product.handle,
                price: product.variants[0]?.price || null
            }

        })

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
