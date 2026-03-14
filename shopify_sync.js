import axios from "axios"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

const SHOPIFY_STORE = "YOURSTORE.myshopify.com"
const SHOPIFY_TOKEN = "SHOPIFY_ADMIN_API_TOKEN"

const db = await open({
filename:"./nde.db",
driver:sqlite3.Database
})

async function syncProducts(){

let url = `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json?limit=250`

let total = 0

while(url){

const res = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":SHOPIFY_TOKEN
}
})

const products = res.data.products

for(const p of products){

const price = p.variants[0]?.price || 0
const sku = p.variants[0]?.sku || ""

await db.run(

`INSERT OR REPLACE INTO products(title,price,url,sku)
VALUES(?,?,?,?)`,

[
p.title,
price,
`https://ndestore.com/products/${p.handle}`,
sku
]

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

}

console.log("Shopify Sync Completed")
console.log("Products Synced:",total)

}

await syncProducts()

process.exit()
