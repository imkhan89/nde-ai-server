require("dotenv").config();

const fs = require("fs");
const path = require("path");

/* =====================================================
PATHS
===================================================== */

const ROOT = __dirname;

const INDEX_DIR = path.join(ROOT,"index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR,"product_index.json");
const SEARCH_INDEX_FILE = path.join(INDEX_DIR,"search_index.json");

/* =====================================================
ENSURE INDEX FOLDER EXISTS
===================================================== */

if(!fs.existsSync(INDEX_DIR)){
fs.mkdirSync(INDEX_DIR,{recursive:true});
}

/* =====================================================
CHECK PRODUCT INDEX
===================================================== */

if(!fs.existsSync(PRODUCT_INDEX_FILE)){

console.log("product_index.json missing. Run buildProductIndex.js first.");

process.exit(0);

}

/* =====================================================
LOAD PRODUCT INDEX
===================================================== */

let products = [];

try{

products = JSON.parse(
fs.readFileSync(PRODUCT_INDEX_FILE,"utf8")
);

}catch(err){

console.log("Unable to read product_index.json");
process.exit(1);

}

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
.filter(w => w.length > 2);

}

/* =====================================================
BUILD SEARCH INDEX
===================================================== */

let SEARCH_INDEX = {};

for(const product of products){

const text = [

product.title || "",
(product.tags || []).join(" "),
product.type || "",
product.vendor || ""

].join(" ");

const tokens = tokenize(text);

for(const token of tokens){

if(!SEARCH_INDEX[token]){
SEARCH_INDEX[token] = [];
}

SEARCH_INDEX[token].push({

id: product.id,
title: product.title,
handle: product.handle

});

}

}

/* =====================================================
SAVE SEARCH INDEX
===================================================== */

fs.writeFileSync(
SEARCH_INDEX_FILE,
JSON.stringify(SEARCH_INDEX,null,2)
);

console.log("Search index created.");
console.log("Products indexed:",products.length);
