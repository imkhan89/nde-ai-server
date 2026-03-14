import axios from "axios"
import config from "../config.js"
import { log } from "../utils/logger.js"

export async function syncShopify(db){

if(!config.SHOPIFY_STORE || !config.SHOPIFY_ACCESS_TOKEN){

log("Shopify sync skipped — credentials missing")

return

}

try{

const url = `https://${config.SHOPIFY_STORE}/admin/api/2024-01/products.json`

const res = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":config.SHOPIFY_ACCESS_TOKEN
}
})

const products = res.data.products

for(const p of products){

const variant = p.variants[0]

await db.run(
"INSERT OR REPLACE INTO products(id,title,price,sku,handle) VALUES(?,?,?,?,?)",
[p.id,p.title,variant.price,variant.sku,p.handle]
)

}

log(`Shopify sync completed: ${products.length} products`)

}catch(error){

log("Shopify sync failed")

}

}
import axios from "axios"
import config from "../config.js"
import { log } from "../utils/logger.js"

export async function syncShopify(db){

if(!config.SHOPIFY_STORE || !config.SHOPIFY_ACCESS_TOKEN){

log("Shopify sync skipped — credentials missing")

return

}

try{

const url = `https://${config.SHOPIFY_STORE}/admin/api/2024-01/products.json`

const res = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":config.SHOPIFY_ACCESS_TOKEN
}
})

const products = res.data.products

for(const p of products){

const variant = p.variants[0]

await db.run(
"INSERT OR REPLACE INTO products(id,title,price,sku,handle) VALUES(?,?,?,?,?)",
[p.id,p.title,variant.price,variant.sku,p.handle]
)

}

log(`Shopify sync completed: ${products.length} products`)

}catch(error){

log("Shopify sync failed")

}

}
