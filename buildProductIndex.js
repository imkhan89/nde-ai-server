require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* =====================================================
SHOPIFY CONFIG
===================================================== */

const SHOP = "347657-7d.myshopify.com";
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

const API = `https://${SHOP}/admin/api/2023-10/products.json`;

/* =====================================================
FILES
===================================================== */

const INDEX_DIR = path.join(__dirname,"index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR,"product_index.json");

/* =====================================================
MEMORY
===================================================== */

let PRODUCTS = [];

/* =====================================================
SLEEP
===================================================== */

function sleep(ms){
return new Promise(resolve => setTimeout(resolve, ms));
}

/* =====================================================
FETCH PRODUCTS FROM SHOPIFY
===================================================== */

async function fetchProducts(){

let since_id = 0;

while(true){

try{

const res = await axios.get(API,{

headers:{
"X-Shopify-Access-Token": TOKEN,
"Content-Type": "application/json"
},

params:{
limit:250,
since_id: since_id
}

});

const products = res.data.products;

if(!products || products.length === 0){
break;
}

PRODUCTS.push(...products);

since_id = products[products.length - 1].id;

console.log("Products Loaded:", PRODUCTS.length);

await sleep(500);

}catch(error){

console.log("Shopify API Error:", error.message);

await sleep(2000);

}

}

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
.filter(word => word.length > 2);

}

/* =====================================================
BUILD PRODUCT INDEX
===================================================== */

function buildIndex(){

return PRODUCTS.map(product => {

const title = product.title ? product.title.toLowerCase() : "";

const tags = product.tags
? product.tags.split(",").map(t => t.trim().toLowerCase())
: [];

const tokens = tokenize(title + " " + tags.join(" "));

return {

id: product.id,
title: title,
handle: product.handle,
vendor: product.vendor || "",
type: product.product_type || "",
tags: tags,
tokens: tokens,

image: product.image ? product.image.src : "",

variants: product.variants.map(v => ({

id: v.id,
title: v.title,
sku: v.sku,
price: parseFloat(v.price),
inventory_quantity: v.inventory_quantity,
available: v.available

}))

};

});

}

/* =====================================================
SAVE INDEX
===================================================== */

function saveIndex(index){

if(!fs.existsSync(INDEX_DIR)){
fs.mkdirSync(INDEX_DIR);
}

fs.writeFileSync(
PRODUCT_INDEX_FILE,
JSON.stringify(index,null,2)
);

}

/* =====================================================
MAIN EXECUTION
===================================================== */

async function run(){

if(!TOKEN){

console.log("ERROR: Missing SHOPIFY_ADMIN_API_TOKEN in .env file");
process.exit(1);

}

console.log("Downloading Shopify product catalog...");

await fetchProducts();

console.log("Building product index...");

const index = buildIndex();

saveIndex(index);

console.log("=================================");
console.log("Product index successfully built");
console.log("Total products:", index.length);
console.log("Saved to: index/product_index.json");
console.log("=================================");

}

run();
