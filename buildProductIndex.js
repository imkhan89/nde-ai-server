require("dotenv").config();

const axios = require("axios");
const fs = require("fs");

const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

const API = `https://${SHOP}/admin/api/2025-04/products.json`;

let PRODUCTS = [];

function sleep(ms){
  return new Promise(r => setTimeout(r, ms));
}

async function fetchProducts(){

  let since_id = 0;

  while(true){

    const res = await axios.get(API,{
      headers:{
        "X-Shopify-Access-Token": TOKEN
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

    console.log("Loaded:", PRODUCTS.length);

    await sleep(300); // avoid Shopify rate limits
  }
}

async function run(){

  console.log("Downloading Shopify catalog...");

  await fetchProducts();

  const index = PRODUCTS.map(p => ({

    id: p.id,
    title: p.title,
    handle: p.handle,
    tags: p.tags,
    type: p.product_type,
    vendor: p.vendor,

    variants: p.variants.map(v => ({
      id: v.id,
      title: v.title,
      sku: v.sku
    }))

  }));

  fs.writeFileSync(
    "products_index.json",
    JSON.stringify(index,null,2)
  );

  console.log("Product index created");
  console.log("Total products:", index.length);
}

run();
