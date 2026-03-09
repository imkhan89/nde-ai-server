/* ======================================================
SHOPIFY PRODUCT INTELLIGENCE INDEX BUILDER
ndestore.com AI Commerce Engine
====================================================== */

require("dotenv").config()
const fs = require("fs")
const path = require("path")
const axios = require("axios")

const SHOP = process.env.SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const API_VERSION = process.env.SHOPIFY_API_VERSION

const OUTPUT = path.join(__dirname, "data/product_index.json")

/* ======================================================
NORMALIZE TEXT
====================================================== */

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

/* ======================================================
EXTRACT VEHICLE DATA FROM TITLE
====================================================== */

function extractVehicle(title){

const yearMatch = title.match(/\b(19|20)\d{2}\s*-\s*(19|20)\d{2}\b/)

const yearRange = yearMatch ? yearMatch[0] : null

let make = null
let model = null

const makes = [
"toyota",
"honda",
"suzuki",
"kia",
"hyundai",
"haval",
"changan",
"proton",
"mg",
"nissan"
]

for(const m of makes){

if(title.includes(m)){
make = m
break
}

}

if(make){

const parts = title.split(make)

if(parts.length > 1){

model = parts[1].trim().split(" ")[0]

}

}

return{
make,
model,
yearRange
}

}

/* ======================================================
FETCH PRODUCTS FROM SHOPIFY
====================================================== */

async function fetchProducts(){

let products = []
let url = `https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=250`

while(url){

const res = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":TOKEN
}
})

products = products.concat(res.data.products)

const link = res.headers.link

if(link && link.includes('rel="next"')){

const next = link.match(/<(.*?)>; rel="next"/)

url = next ? next[1] : null

}else{

url = null

}

}

return products

}

/* ======================================================
BUILD PRODUCT INDEX
====================================================== */

async function buildIndex(){

console.log("Fetching Shopify products...")

const products = await fetchProducts()

console.log("Products fetched:",products.length)

const index = []

for(const p of products){

const title = normalize(p.title)

const vehicle = extractVehicle(title)

index.push({

id:p.id,
title:p.title,
handle:p.handle,
price:p.variants[0].price,

make:vehicle.make,
model:vehicle.model,
year_range:vehicle.yearRange,

searchable:title

})

}

fs.writeFileSync(OUTPUT,JSON.stringify(index,null,2))

console.log("Product index built successfully")

}

buildIndex()
