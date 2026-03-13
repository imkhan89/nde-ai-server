const fs = require("fs")
const path = require("path")
const https = require("https")

const SHOPIFY_STORE = process.env.SHOPIFY_STORE
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

const OUTPUT_PATH =
path.join(__dirname,"../data/shopify_products.json")

function fetchProducts(){

return new Promise((resolve,reject)=>{

let products = []

let url = `/admin/api/2023-10/products.json?limit=250`

function getPage(pageUrl){

const options = {

hostname: SHOPIFY_STORE,
path: pageUrl,
method: "GET",
headers: {

"X-Shopify-Access-Token": SHOPIFY_TOKEN,
"Content-Type": "application/json"

}

}

const req = https.request(options,res=>{

let data = ""

res.on("data",chunk=>{

data += chunk

})

res.on("end",()=>{

try{

const json = JSON.parse(data)

if(json.products){

json.products.forEach(p=>{

products.push({

title:p.title,
handle:p.handle,
url:`https://${SHOPIFY_STORE}/products/${p.handle}`

})

})

}

const link = res.headers.link

if(link && link.includes('rel="next"')){

const next = link.match(/<([^>]+)>; rel="next"/)

if(next){

const nextPath = next[1].split(SHOPIFY_STORE)[1]

getPage(nextPath)

return

}

}

resolve(products)

}catch(err){

reject(err)

}

})

})

req.on("error",reject)

req.end()

}

getPage(url)

})

}

async function syncCatalog(){

try{

console.log("Starting Shopify catalog sync")

const products = await fetchProducts()

fs.writeFileSync(

OUTPUT_PATH,

JSON.stringify(products,null,2)

)

console.log("Shopify catalog synced:",products.length)

}catch(err){

console.log("Shopify sync failed:",err.message)

}

}

module.exports = {

syncCatalog

}
