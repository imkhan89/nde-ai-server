require("dotenv").config();

const fs = require("fs");
const path = require("path");

/* =====================================================
FILE PATHS
===================================================== */

const INDEX_DIR = path.join(__dirname,"index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR,"product_index.json");
const SEARCH_INDEX_FILE = path.join(INDEX_DIR,"search_index.json");


/* =====================================================
LOAD PRODUCT INDEX
===================================================== */

if(!fs.existsSync(PRODUCT_INDEX_FILE)){

console.log("ERROR: product_index.json not found in /index folder");
process.exit(1);

}

const products = JSON.parse(
fs.readFileSync(PRODUCT_INDEX_FILE,"utf8")
);


/* =====================================================
TOKENIZER
===================================================== */

function tokenize(text){

if(!text) return [];

return text
.toString()
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.split(/\s+/)
.filter(word => word.length > 2);

}


/* =====================================================
BUILD SEARCH INDEX
===================================================== */

let SEARCH_INDEX = {};

for(const product of products){

const fields = [

product.title || "",
(product.tags || []).join(" "),
product.type || "",
product.vendor || ""

].join(" ");

const tokens = tokenize(fields);

for(const token of tokens){

if(!SEARCH_INDEX[token]){
SEARCH_INDEX[token] = [];
}

/* store minimal product data for speed */

SEARCH_INDEX[token].push({

id: product.id,
title: product.title,
handle: product.handle,
vendor: product.vendor,
type: product.type

});

}

}


/* =====================================================
SAVE SEARCH INDEX
===================================================== */

if(!fs.existsSync(INDEX_DIR)){
fs.mkdirSync(INDEX_DIR);
}

fs.writeFileSync(

SEARCH_INDEX_FILE,
JSON.stringify(SEARCH_INDEX,null,2)

);

console.log("=================================");
console.log("Search index successfully created");
console.log("Products indexed:", products.length);
console.log("Saved to: index/search_index.json");
console.log("=================================");
