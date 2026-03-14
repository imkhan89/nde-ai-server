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

let url = `https://${store}/admin/api/${version}/products.json?limit=250`
let total = 0

while(url){

const response = await axios.get(url,{
headers:{
"X-Shopify-Access-Token": token,
"Content-Type":"application/json"
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

total++

}

const link = response.headers.link

if(link && link.includes('rel="next"')){

url = link.split(";")[0].replace("<","").replace(">","")

}else{

url = null

}

}

console.log("Shopify sync completed:", total, "products")

}catch(err){

console.log("Shopify sync failed:", err.message)

}

}
