const fs = require("fs")
const path = require("path")

const SHOPIFY_CACHE =
path.join(__dirname,"../data/shopify_products.json")

const OUTPUT =
path.join(__dirname,"../data/product_index.json")

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function extractPart(title){

const parts = [
"wiper",
"filter",
"air filter",
"oil filter",
"cabin filter",
"spark plug",
"brake pad",
"brake shoe",
"brake rotor",
"radiator cap",
"coolant",
"horn",
"mat",
"sun shade"
]

title = normalize(title)

for(const p of parts){

if(title.includes(p)){
return p
}

}

return ""

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

function build(){

const raw = fs.readFileSync(SHOPIFY_CACHE,"utf8")

const products = JSON.parse(raw)

let index=[]

products.forEach(p=>{

const vehicle = detectVehicle(p.title)

index.push({

title:p.title,
url:p.url || p.handle,
part:extractPart(p.title),
make:vehicle.make,
model:vehicle.model

})

})

fs.writeFileSync(OUTPUT,JSON.stringify(index,null,2))

console.log("Product index built:",index.length)

}

build()
