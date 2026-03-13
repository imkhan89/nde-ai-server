const fs = require("fs")
const path = require("path")

const indexPath = path.join(__dirname,"../data/product_index.json")

let productIndex = []

function loadIndex(){

try{

const raw = fs.readFileSync(indexPath,"utf8")

productIndex = JSON.parse(raw)

console.log("Local product index loaded:",productIndex.length)

}catch(err){

console.log("Product index load error:",err.message)

productIndex = []

}

}

loadIndex()

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function searchProducts(query){

if(!query) return {success:false}

const q = normalize(query)

const words = q.split(" ")

let results = []

productIndex.forEach(p=>{

const title = normalize(p.title)
const part = normalize(p.part)
const make = normalize(p.make)
const model = normalize(p.model)

let score = 0

words.forEach(w=>{

if(title.includes(w)) score += 3
if(part.includes(w)) score += 2
if(make.includes(w)) score += 1
if(model.includes(w)) score += 1

})

if(score > 0){

results.push({
score,
title:p.title,
url:p.url
})

}

})

results = results
.sort((a,b)=>b.score-a.score)
.slice(0,5)

if(results.length === 0){
return {success:false}
}

return {
success:true,
products:results
}

}

module.exports = {
searchProducts
}
