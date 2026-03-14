import axios from "axios"

export async function syncShopify(db){

const store = process.env.SHOPIFY_STORE_DOMAIN
const token = process.env.SHOPIFY_ADMIN_API_TOKEN
const version = process.env.SHOPIFY_API_VERSION || "2024-01"

if(!store || !token){

console.log("Shopify credentials missing")
return

}

try{

let page = 1
let total = 0

while(true){

const url = `https://${store}/admin/api/${version}/products.json?limit=250&page=${page}`

const res = await axios.get(url,{
headers:{
"X-Shopify-Access-Token": token
}
})

const products = res.data.products

if(!products || products.length === 0){
break
}

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

total++

}

page++

}

console.log("Shopify sync completed:", total, "products")

}catch(err){

console.log("Shopify sync failed:", err.message)

}

}
