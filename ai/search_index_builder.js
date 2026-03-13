const fs = require("fs")
const path = require("path")

const indexFile = path.join(__dirname,"../data/product_index.json")

function ensureIndex(){

if(!fs.existsSync(indexFile)){

fs.writeFileSync(indexFile,"[]")

console.log("Product index created")

}

}

function buildIndex(){

ensureIndex()

console.log("Product index loaded")

}

buildIndex()

module.exports = {
buildIndex
}
