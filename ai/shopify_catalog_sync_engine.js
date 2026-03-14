const fs = require("fs")
const path = require("path")
const axios = require("axios")
const { exec } = require("child_process")

const SHOPIFY_STORE = process.env.SHOPIFY_STORE
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

const OUTPUT_FILE =
path.join(__dirname,"../data/shopify_products.json")

async function fetchAllProducts(){

let products = []
let url =
`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`

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
OUTPUT_FILE,
JSON.stringify(products,null,2)
)

console.log("Shopify Catalog Sync Engine Started")

buildProductIndex()

}catch(err){

console.log("Shopify sync error:",err.message)

}

}

function buildProductIndex(){

exec("node scripts/build_product_index.js",(err,stdout,stderr)=>{

if(err){
console.log("Index build error:",err.message)
return
}

if(stdout){
console.log(stdout)
}

if(stderr){
console.log(stderr)
}

})

}

module.exports = {
fetchAllProducts
}
