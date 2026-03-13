const fs = require("fs")
const axios = require("axios")

const SHOPIFY_STORE = "ndestore.com"
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN

const OUTPUT_FILE = "./data/product_index.json"

async function fetchAllProducts(){

let allProducts = []
let url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`

while(url){

console.log("Fetching products from Shopify...")

const response = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":ACCESS_TOKEN
}
})

const products = response.data.products

products.forEach(product=>{

allProducts.push({
id:product.id,
title:product.title,
handle:product.handle,
tags:product.tags,
vendor:product.vendor,
product_type:product.product_type,
url:`https://ndestore.com/products/${product.handle}`
})

})

const linkHeader = response.headers.link

if(linkHeader && linkHeader.includes('rel="next"')){

const match = linkHeader.match(/<(.*?)>; rel="next"/)

url = match ? match[1] : null

}else{

url = null

}

}

return allProducts

}

async function buildIndex(){

console.log("Building Shopify product index")

const products = await fetchAllProducts()

console.log("Total products downloaded:",products.length)

fs.writeFileSync(
OUTPUT_FILE,
JSON.stringify(products,null,2)
)

console.log("product_index.json created successfully")

}

buildIndex().catch(err=>{
console.log("Index build error:",err.message)
})
