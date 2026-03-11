/* =====================================================
SHOPIFY PRODUCT SYNC
Automatically generates products_index.json
===================================================== */

require("dotenv").config()

const axios = require("axios")
const fs = require("fs")
const path = require("path")


/* =====================================================
SHOPIFY CONFIG
===================================================== */

const SHOP = process.env.SHOPIFY_STORE
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

const API_VERSION = "2024-01"

const PRODUCTS_FILE = path.join(__dirname,"../data/products_index.json")


/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

if(!text) return ""

return text
.toString()
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}


/* =====================================================
DETECT PART FROM TITLE
===================================================== */

function detectPart(title){

const t = normalize(title)

if(t.includes("wheel bearing")) return "wheel bearing"
if(t.includes("brake pad")) return "brake pads"
if(t.includes("brake shoe")) return "brake shoes"
if(t.includes("air filter")) return "air filter"
if(t.includes("cabin filter")) return "cabin filter"
if(t.includes("shock")) return "shock absorber"
if(t.includes("bumper")) return "bumper"
if(t.includes("spark plug")) return "spark plug"
if(t.includes("radiator cap")) return "radiator cap"
if(t.includes("coolant")) return "coolant"
if(t.includes("floor mat")) return "floor mat"
if(t.includes("sun shade")) return "sun shade"

return null

}


/* =====================================================
DETECT POSITION
===================================================== */

function detectPosition(title){

const t = normalize(title)

if(t.includes("front")) return "front"
if(t.includes("rear")) return "rear"
if(t.includes("left")) return "left"
if(t.includes("right")) return "right"

return null

}


/* =====================================================
DETECT VEHICLE
===================================================== */

function detectVehicle(title){

const t = normalize(title)

let make = null
let model = null

if(t.includes("toyota")) make = "toyota"
if(t.includes("honda")) make = "honda"
if(t.includes("suzuki")) make = "suzuki"
if(t.includes("kia")) make = "kia"
if(t.includes("hyundai")) make = "hyundai"

if(t.includes("corolla")) model = "corolla"
if(t.includes("civic")) model = "civic"
if(t.includes("alto")) model = "alto"
if(t.includes("sportage")) model = "sportage"
if(t.includes("elantra")) model = "elantra"

return { make, model }

}


/* =====================================================
FETCH PRODUCTS
===================================================== */

async function fetchProducts(){

let products = []

let url = `https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=250`

while(url){

const response = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":ACCESS_TOKEN
}
})

const data = response.data.products || []

products = products.concat(data)

const linkHeader = response.headers.link

if(linkHeader && linkHeader.includes('rel="next"')){

const match = linkHeader.match(/<([^>]+)>; rel="next"/)

url = match ? match[1] : null

}else{

url = null

}

}

return products

}


/* =====================================================
BUILD PRODUCT INDEX
===================================================== */

function buildIndex(products){

const index = []

for(const p of products){

const title = p.title

const handle = p.handle

const url = `https://www.ndestore.com/products/${handle}`

const part = detectPart(title)

const position = detectPosition(title)

const vehicle = detectVehicle(title)

index.push({

title:title,
part:part,
position:position,
make:vehicle.make,
model:vehicle.model,
url:url

})

}

return index

}


/* =====================================================
SAVE FILE
===================================================== */

function saveIndex(index){

fs.writeFileSync(

PRODUCTS_FILE,

JSON.stringify(index,null,2),

"utf8"

)

}


/* =====================================================
RUN SYNC
===================================================== */

async function run(){

try{

console.log("Fetching Shopify products...")

const products = await fetchProducts()

console.log("Products fetched:",products.length)

const index = buildIndex(products)

saveIndex(index)

console.log("products_index.json generated successfully")

}catch(err){

console.error("Sync error:",err.message)

}

}

run()
