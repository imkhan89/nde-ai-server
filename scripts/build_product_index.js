const fs = require("fs")
const path = require("path")

const SHOPIFY_PRODUCTS =
path.join(__dirname,"../data/shopify_products.json")

const OUTPUT_INDEX =
path.join(__dirname,"../data/product_index.json")

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

const parts = [
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

function buildIndex(){

if(!fs.existsSync(SHOPIFY_PRODUCTS)){
console.log("shopify_products.json not found")
return
}

const raw = fs.readFileSync(SHOPIFY_PRODUCTS,"utf8")

const products = JSON.parse(raw)

let index=[]

products.forEach(p=>{

const vehicle = detectVehicle(p.title)

let url=""

if(p.url){
url=p.url
}
else if(p.handle){
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
OUTPUT_INDEX,
JSON.stringify(index,null,2)
)

console.log("INDEX CREATED:",index.length)

}

buildIndex()
