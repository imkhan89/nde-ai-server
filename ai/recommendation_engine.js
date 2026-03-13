const fs = require("fs")
const path = require("path")

const indexPath = path.join(__dirname,"../data/product_index.json")

let products = []

function loadProducts(){

try{

const raw = fs.readFileSync(indexPath,"utf8")

products = JSON.parse(raw)

}catch(err){

console.log("Recommendation engine index error:",err.message)

products = []

}

}

loadProducts()

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function getRecommendations(query){

if(!query) return []

const q = normalize(query)

const words = q.split(" ")

let recommendations = []

products.forEach(p=>{

const title = normalize(p.title)
const part = normalize(p.part)

let score = 0

words.forEach(w=>{

if(title.includes(w)) score++
if(part.includes(w)) score++

})

if(score > 0){

recommendations.push({
score,
title:p.title
})

}

})

recommendations = recommendations
.sort((a,b)=>b.score-a.score)
.slice(0,3)

return recommendations.map(r=>r.title)

}

module.exports = {
getRecommendations
}
