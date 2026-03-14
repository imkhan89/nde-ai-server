const fs = require("fs")
const path = require("path")

const INDEX_FILE =
path.join(__dirname,"../data/product_index.json")

let productIndex=[]

function loadIndex(){

try{

if(!fs.existsSync(INDEX_FILE)){
console.log("Product index missing")
return
}

const raw=fs.readFileSync(INDEX_FILE,"utf8")

productIndex=JSON.parse(raw)

console.log("Product index loaded:",productIndex.length)

}catch(err){

console.log("Index load error:",err.message)

}

}

loadIndex()

function normalize(text){

return (text||"")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function searchProducts(query){

const q=normalize(query)

const words=q.split(" ")

let results=[]

productIndex.forEach(p=>{

const title=normalize(p.title)

let score=0

words.forEach(w=>{

if(title.includes(w)){
score++
}

})

if(score>0){

results.push({
score,
title:p.title,
url:p.url
})

}

})

results=results
.sort((a,b)=>b.score-a.score)
.slice(0,5)

if(results.length===0){
return {success:false}
}

return {
success:true,
products:results
}

}

module.exports={
searchProducts
}
