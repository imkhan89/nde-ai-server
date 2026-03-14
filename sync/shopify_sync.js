import axios from "axios"
import config from "../config.js"

export async function syncShopify(db){

if(!config.SHOPIFY_STORE || !config.SHOPIFY_ACCESS_TOKEN){

console.log("Shopify credentials missing")

return

}

try{

let url = `https://${config.SHOPIFY_STORE}/admin/api/2024-01/products.json?limit=250`

let total = 0

while(url){

const response = await axios.get(url,{
headers:{
"X-Shopify-Access-Token": config.SHOPIFY_ACCESS_TOKEN
}
})

const products = response.data.products

for(const product of products){

const variant = product.variants?.[0]

if(!variant) continue

await db.run(
`INSERT OR REPLACE INTO products
(id,title,price,sku,handle)
VALUES (?,?,?,?,?)`,
[
product.id,
product.title,
variant.price,
variant.sku,
product.handle
]
)

}

total += products.length

const link = response.headers.link

if(link && link.includes('rel="next"')){

url = link.split(";")[0].replace("<","").replace(">","")

}else{

url = null

}

}

console.log(`Shopify sync completed: ${total} products`)

}catch(err){

console.error("Shopify sync failed", err.message)

}

}
