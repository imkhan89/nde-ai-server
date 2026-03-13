const fs = require("fs")
const path = require("path")

const indexFile = path.join(__dirname,"../data/product_index.json")

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9\- ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function extractYear(title){

const range = title.match(/\b(19|20)\d{2}\s*-\s*(19|20)\d{2}\b/)
if(range){
return range[0]
}

const single = title.match(/\b(19|20)\d{2}\b/)
if(single){
return single[0]
}

return ""

}

function extractMake(title){

const makes = [
"toyota",
"honda",
"suzuki",
"daihatsu",
"nissan",
"mitsubishi",
"kia",
"hyundai",
"changan",
"proton",
"mg",
"chevrolet"
]

const t = normalize(title)

for(let make of makes){

if(t.includes(make)){
return make
}

}

return ""

}

function extractModel(title){

const models = [
"corolla",
"civic",
"city",
"alto",
"cultus",
"swift",
"wagonr",
"mehran",
"bolan",
"carry",
"yaris",
"revo",
"hilux",
"sportage",
"elantra",
"tucson",
"sonata"
]

const t = normalize(title)

for(let model of models){

if(t.includes(model)){
return model
}

}

return ""

}

function extractPart(title){

const parts = [
"air filter",
"oil filter",
"cabin filter",
"ac filter",
"spark plug",
"brake pad",
"brake pads",
"brake disc",
"brake rotor",
"radiator",
"radiator cap",
"engine mount",
"engine mounting",
"wheel bearing",
"clutch plate",
"clutch kit",
"fuel filter",
"wiper blade",
"horn",
"headlight",
"tail light"
]

const t = normalize(title)

for(let part of parts){

if(t.includes(part)){
return part
}

}

return ""

}

function buildIndex(products){

let index = []

products.forEach(p=>{

const title = p.title || ""
const url = p.url || ""

index.push({

title:title,
url:url,
make:extractMake(title),
model:extractModel(title),
year:extractYear(title),
part:extractPart(title)

})

})

fs.writeFileSync(indexFile,JSON.stringify(index,null,2))

console.log("Product index built:",index.length)

}

function loadIndex(){

try{

const raw = fs.readFileSync(indexFile,"utf8")

const data = JSON.parse(raw)

console.log("Product index loaded:",data.length)

return data

}catch(err){

console.log("Product index load error:",err.message)

return []

}

}

module.exports = {
buildIndex,
loadIndex
}
