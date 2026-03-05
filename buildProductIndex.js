require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* =====================================================
CONFIGURATION
===================================================== */

const SHOP = "347657-7d.myshopify.com";
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

const API = `https://${SHOP}/admin/api/2023-10/products.json`;

let PRODUCTS = [];


/* =====================================================
SLEEP HELPER
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

console.log("Loaded products:", PRODUCTS.length);

await sleep(500);

}catch(error){

console.log("Shopify API Error:", error.message);

await sleep(2000);

}

}

}


/* =====================================================
BUILD PRODUCT INDEX
===================================================== */

function buildIndex(){

return PRODUCTS.map(product => ({

id: product.id,

title: product.title ? product.title.toLowerCase() : "",

handle: product.handle,

vendor: product.vendor || "",

type: product.product_type || "",

tags: product.tags
? product.tags.split(",").map(tag => tag.trim().toLowerCase())
: [],

image: product.image ? product.image.src : "",

variants: product.variants.map(v => ({

id: v.id,

title: v.title,

sku: v.sku,

price: parseFloat(v.price),

inventory_quantity: v.inventory_quantity,

available: v.available

}))

}));

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

const index = buildIndex();

const indexDir = path.join(__dirname,"index");

if(!fs.existsSync(indexDir)){
fs.mkdirSync(indexDir);
}

fs.writeFileSync(

path.join(indexDir,"product_index.json"),

JSON.stringify(index,null,2)

);

console.log("=================================");
console.log("Product index successfully built");
console.log("Total products:", index.length);
console.log("Saved to: index/product_index.json");
console.log("=================================");

}

run();
