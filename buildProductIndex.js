require("dotenv").config();

const fs = require("fs");
const path = require("path");

/* =====================================================
PATHS
===================================================== */

const ROOT = __dirname;

const INDEX_DIR = path.join(ROOT,"index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR,"product_index.json");

/* =====================================================
ENSURE INDEX DIRECTORY
===================================================== */

if(!fs.existsSync(INDEX_DIR)){
fs.mkdirSync(INDEX_DIR,{recursive:true});
}

/* =====================================================
LOAD PRODUCTS FROM SHOPIFY EXPORT OR JSON
===================================================== */

let products=[];

/*
Replace this section with your actual product data source.
Example below assumes a local products.json file.
*/

const PRODUCTS_FILE = path.join(ROOT,"products.json");

if(!fs.existsSync(PRODUCTS_FILE)){

console.error("ERROR: products.json not found.");
process.exit(1);

}

try{

products = JSON.parse(
fs.readFileSync(PRODUCTS_FILE,"utf8")
);

}catch(e){

console.error("ERROR loading products.json");
process.exit(1);

}

/* =====================================================
BUILD PRODUCT INDEX
===================================================== */

const PRODUCT_INDEX = products.map(p => {

return {

id: p.id,
title: p.title || "",
handle: p.handle || "",
vendor: p.vendor || "",
type: p.product_type || "",
tags: p.tags || []

};

});

/* =====================================================
SAVE PRODUCT INDEX
===================================================== */

fs.writeFileSync(

PRODUCT_INDEX_FILE,
JSON.stringify(PRODUCT_INDEX,null,2)

);

console.log("Product index built successfully.");
console.log("Products indexed:",PRODUCT_INDEX.length);
console.log("Index file:",PRODUCT_INDEX_FILE);
