import axios from "axios"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import dotenv from "dotenv"

dotenv.config()

const SHOPIFY_STORE = process.env.SHOPIFY_STORE
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN

const db = await open({
  filename: "./nde.db",
  driver: sqlite3.Database
})

await db.exec(`
CREATE TABLE IF NOT EXISTS products(
  id INTEGER PRIMARY KEY,
  title TEXT,
  price REAL,
  url TEXT,
  sku TEXT
);
`)

async function syncProducts(){

  console.log("Starting Shopify Sync")

  let url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json?limit=250`
  let total = 0

  while(url){

    const res = await axios.get(url,{
      headers:{
        "X-Shopify-Access-Token":SHOPIFY_TOKEN
      }
    })

    const products = res.data.products || []

    for(const p of products){

      const variant = p.variants?.[0] || {}

      const title = p.title || ""
      const price = variant.price || 0
      const sku = variant.sku || ""
      const productUrl = `https://ndestore.com/products/${p.handle}`

      await db.run(
        `INSERT OR REPLACE INTO products(title,price,url,sku)
         VALUES(?,?,?,?)`,
        [title,price,productUrl,sku]
      )

      total++
    }

    const linkHeader = res.headers.link

    if(linkHeader && linkHeader.includes('rel="next"')){
      const match = linkHeader.match(/<([^>]+)>; rel="next"/)
      url = match ? match[1] : null
    }else{
      url = null
    }

    console.log("Products Synced:", total)
  }

  console.log("Shopify Sync Completed")
  console.log("Total Products:", total)

}

await syncProducts()

process.exit()
