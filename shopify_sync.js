import axios from "axios"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

const SHOPIFY_STORE = process.env.SHOPIFY_STORE
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN

const db = await open({
  filename: "./nde.db",
  driver: sqlite3.Database
})

async function syncProducts(){

  console.log("Starting Shopify Sync...")

  let pageInfo = null
  let total = 0

  while(true){

    let url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json?limit=250`

    if(pageInfo){
      url += `&page_info=${pageInfo}`
    }

    const res = await axios.get(url,{
      headers:{
        "X-Shopify-Access-Token":SHOPIFY_TOKEN
      }
    })

    const products = res.data.products

    if(!products.length) break

    for(const p of products){

      const variant = p.variants?.[0] || {}

      const title = p.title
      const price = variant.price || 0
      const sku = variant.sku || ""
      const url = `https://ndestore.com/products/${p.handle}`

      await db.run(
        `INSERT OR REPLACE INTO products(title,price,url,sku)
         VALUES(?,?,?,?)`,
        [title,price,url,sku]
      )

      total++
    }

    const link = res.headers.link

    if(link && link.includes('rel="next"')){
      const match = link.match(/page_info=([^&>]+)/)
      pageInfo = match ? match[1] : null
    }else{
      break
    }

    console.log("Products Synced:",total)

  }

  console.log("Shopify Sync Completed")
  console.log("Total Products:",total)

}

await syncProducts()

process.exit()
