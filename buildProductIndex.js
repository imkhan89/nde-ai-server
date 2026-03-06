require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");

/* =====================================================
SHOPIFY CONFIG
===================================================== */

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

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
FETCH PRODUCTS FROM SHOPIFY
===================================================== */

async function fetchProducts(){

let products=[];
let pageInfo=null;

try{

do{

let url=`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=250`;

if(pageInfo){
url+=`&page_info=${pageInfo}`;
}

const res = await axios.get(url,{
headers:{
"X-Shopify-Access-Token":SHOPIFY_TOKEN
}
});

products.push(...res.data.products);

/* pagination */

const link=res.headers.link;

if(link && link.includes("rel=\"next\"")){

const match = link.match(/page_info=([^&>]+)/);

pageInfo = match ? match[1] : null;

}else{
pageInfo=null;
}

}while(pageInfo);

}catch(e){

console.error("Shopify API error:",e.message);
process.exit(1);

}

return products;

}

/* =====================================================
BUILD PRODUCT INDEX
===================================================== */

async function build(){

console.log("Fetching Shopify products...");

const products = await fetchProducts();

const PRODUCT_INDEX = [];

for(const p of products){

const payload={

id:p.id,
title:p.title || "",
handle:p.handle || "",
vendor:p.vendor || "",
type:p.product_type || "",
tags:p.tags ? p.tags.split(",") : []

};

PRODUCT_INDEX.push(payload);

}

/* save file */

fs.writeFileSync(
PRODUCT_INDEX_FILE,
JSON.stringify(PRODUCT_INDEX,null,2)
);

console.log("Product index built successfully.");
console.log("Products indexed:",PRODUCT_INDEX.length);
console.log("Index file:",PRODUCT_INDEX_FILE);

}

build();
