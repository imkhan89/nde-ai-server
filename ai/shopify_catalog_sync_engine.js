const fs = require("fs")
const path = require("path")
const axios = require("axios")

const SHOPIFY_STORE = process.env.SHOPIFY_STORE
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

const SHOPIFY_OUTPUT =
path.join(__dirname,"../data/shopify_products.json")

const INDEX_OUTPUT =
path.join(__dirname,"../data/product_index.json")

async function fetchAllProducts(){

let products=[]
let url=`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`

try{

while(url){

const res = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":SHOPIFY_TOKEN
}
})

const data = res.data.products || []

products = products.concat(data)

console.log(`Fetched ${data.length} products`)

const link = res.headers.link

if(link && link.includes('rel="next"')){

const match = link.match(/<([^>]+)>;\s*rel="next"/)

url = match ? match[1] : null

}else{
url = null
}

}

console.log("Full Shopify Catalog Loaded:",products.length)

fs.writeFileSync(
SHOPIFY_OUTPUT,
JSON.stringify(products,null,2)
)

buildIndex(products)

console.log("Shopify Catalog Sync Engine Started")

}catch(err){

console.log("Shopify sync error:",err.message)

}

}

function normalize(text){
return (text || "")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()
}

function detectVehicle(title){

title = normalize(title)

let make=""
let model=""

if(title.includes("corolla")){
make="toyota"
model="corolla"
}

if(title.includes("civic")){
make="honda"
model="civic"
}

if(title.includes("swift")){
make="suzuki"
model="swift"
}

if(title.includes("cultus")){
make="suzuki"
model="cultus"
}

return {make,model}

}

function detectPart(title){

title = normalize(title)

const parts=[
"wiper",
"oil filter",
"air filter",
"cabin filter",
"spark plug",
"brake pad",
"brake shoe",
"brake rotor",
"radiator cap",
"coolant",
"horn",
"sun shade",
"car mat"
]

for(const p of parts){

if(title.includes(p)){
return p
}

}

return ""

}

function buildIndex(products){

let index=[]

products.forEach(p=>{

const vehicle = detectVehicle(p.title)

let url=""

if(p.handle){
url="/products/"+p.handle
}

index.push({

title:p.title || "",
url:url,
part:detectPart(p.title),
make:vehicle.make,
model:vehicle.model

})

})

fs.writeFileSync(
INDEX_OUTPUT,
JSON.stringify(index,null,2)
)

console.log("INDEX CREATED:",index.length)

}

module.exports={
fetchAllProducts
}
