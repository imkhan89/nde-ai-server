import fetch from "node-fetch"
import { setCachedProducts } from "../services/shopify_cache.js"

let productCache = []

const SHOPIFY_STORE = "347657-7d.myshopify.com"
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

export async function syncShopifyProducts() {

    try {

        console.log("Starting Shopify product sync...")

        const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/graphql.json`

        const query = `
        {
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                variants(first:1){
                  edges{
                    node{
                      price
                    }
                  }
                }
              }
            }
          }
        }
        `

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": SHOPIFY_TOKEN
            },
            body: JSON.stringify({ query })
        })

        const json = await response.json()

        if (!json.data) {
            console.log("Shopify API response:", JSON.stringify(json, null, 2))
            return []
        }

        const products = json.data.products.edges.map(edge => {

            const node = edge.node

            return {
                id: node.id,
                title: node.title,
                handle: node.handle,
                price: node.variants.edges[0]?.node?.price || null
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
