require("dotenv").config()

const fs = require("fs")
const path = require("path")
const axios = require("axios")

const SHOP = process.env.SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const API_VERSION = process.env.SHOPIFY_API_VERSION

const OUTPUT = path.join(__dirname,"data","product_index.json")

/* =====================================================
NORMALIZE TEXT
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/\+/g," ")
.replace(/-/g," ")
.replace(/\//g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
EXTRACT VEHICLE INFO FROM TITLE
===================================================== */

function extractVehicle(title){

const yearMatch = title.match(/\b(19|20)\d{2}\s*-\s*(19|20)\d{2}\b/)

const yearRange = yearMatch ? yearMatch[0] : null

return {

yearRange

}

}

/* =====================================================
FETCH SHOPIFY PRODUCTS
===================================================== */

async function fetchProducts(){

let products = []
let url = `https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=250`

while(url){

const response = await axios.get(url,{

headers:{
"X-Shopify-Access-Token":TOKEN
}

})

const data = response.data.products

products = products.concat(data)

const link = response.headers.link

if(link && link.includes('rel="next"')){

url = link.split(";")[0].replace("<","").replace(">","")

}else{

url = null

}

}

return products

}

/* =====================================================
BUILD SEARCH INDEX
===================================================== */

function buildIndex(products){

let index=[]

for(const product of products){

const searchable = normalize(

`${product.title} ${product.vendor} ${product.tags}`

)

const vehicle = extractVehicle(product.title)

index.push({

title:product.title,

handle:product.handle,

searchable:searchable,

vehicle:vehicle

})

}

return index

}

/* =====================================================
MAIN PROCESS
===================================================== */

async function main(){

try{

console.log("Fetching Shopify products...")

const products = await fetchProducts()

console.log(`Fetched ${products.length} products`)

console.log("Building product index...")

const index = buildIndex(products)

fs.writeFileSync(

OUTPUT,
JSON.stringify(index,null,2)

)

console.log("Product index generated successfully")

}catch(error){

console.error("Error building product index")

console.error(error.message)

}

}

main()
