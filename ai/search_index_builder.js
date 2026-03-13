const fs = require("fs")
const axios = require("axios")

const SHOPIFY_STORE = "ndestore.com"
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN

const OUTPUT_FILE = "./data/product_index.json"

async function fetchProducts(){

let allProducts = []
let page = 1
let hasMore = true

while(hasMore){

console.log("Fetching products page:",page)

const response = await axios.get(
`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json`,
{
headers:{
"X-Shopify-Access-Token":ACCESS_TOKEN
},
params:{
limit:250,
page:page
}
}
)

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

if(products.length < 250){
hasMore = false
}else{
page++
}

}

return allProducts

}

async function buildIndex(){

console.log("Building Shopify product index")

const products = await fetchProducts()

console.log("Total products:",products.length)

fs.writeFileSync(
OUTPUT_FILE,
JSON.stringify(products,null,2)
)

console.log("product_index.json created successfully")

}

buildIndex().catch(err=>{
console.log("Index build error:",err.message)
})
