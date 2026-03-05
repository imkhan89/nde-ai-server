const axios = require("axios");
const fs = require("fs");

const SHOP = "ndestore.myshopify.com";
const TOKEN = "YOUR_ADMIN_API_TOKEN";

const API = `https://${SHOP}/admin/api/2024-01/products.json`;

let PRODUCTS = [];

function sleep(ms){
 return new Promise(r=>setTimeout(r,ms));
}

async function fetchProducts(){

let since_id = 0;

while(true){

const res = await axios.get(API,{
headers:{
"X-Shopify-Access-Token":TOKEN
},
params:{
limit:250,
since_id
}
});

const products = res.data.products;

if(products.length === 0) break;

PRODUCTS.push(...products);

since_id = products[products.length-1].id;

console.log("Loaded:",PRODUCTS.length);

await sleep(500);

}

}

async function run(){

console.log("Downloading Shopify catalog...");

await fetchProducts();

const index = PRODUCTS.map(p=>({

id:p.id,
title:p.title,
handle:p.handle,
tags:p.tags,
type:p.product_type,
vendor:p.vendor,
variants:p.variants.map(v=>v.title)

}));

fs.writeFileSync(
"products_index.json",
JSON.stringify(index,null,2)
);

console.log("Product index created");

}

run();
