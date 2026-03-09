const fs=require("fs")
const path=require("path")

const INDEX_PATH=path.join(__dirname,"data","product_index.json")

let PRODUCTS=[]

try{

PRODUCTS=JSON.parse(fs.readFileSync(INDEX_PATH))

}catch(e){

console.log("Product index not loaded")

}

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

function searchProducts(query){

const q = normalize(query)

let results=[]

for(const p of PRODUCTS){

if(p.searchable.includes(q)){

results.push(p)

}

}

return results

}

module.exports={searchProducts}
