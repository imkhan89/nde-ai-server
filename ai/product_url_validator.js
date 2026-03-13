const fs = require("fs")
const path = require("path")

const indexPath = path.join(__dirname,"../data/product_index.json")

let products = []

function loadProducts(){

try{

const raw = fs.readFileSync(indexPath,"utf8")

products = JSON.parse(raw)

}catch(err){

console.log("Product index read error:",err.message)

products = []

}

}

function cleanUrl(url){

if(!url) return ""

let u = url.trim()

if(!u.startsWith("http")){
u = "https://www.ndestore.com" + u
}

u = u.replace("http://","https://")

return u

}

function validateUrls(){

loadProducts()

let updated = []

products.forEach(p=>{

let url = cleanUrl(p.url)

updated.push({
...p,
url:url
})

})

fs.writeFileSync(indexPath,JSON.stringify(updated,null,2))

console.log("Product URLs validated:",updated.length)

}

module.exports = {
validateUrls
}
