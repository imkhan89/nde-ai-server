require("dotenv").config();

const fs = require("fs");
const path = require("path");

/* =====================================================
PATHS
===================================================== */

const ROOT = __dirname;

const INDEX_DIR = path.join(ROOT, "index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR, "product_index.json");
const SEARCH_INDEX_FILE = path.join(INDEX_DIR, "search_index.json");

/* =====================================================
ENSURE INDEX DIRECTORY
===================================================== */

if (!fs.existsSync(INDEX_DIR)) {
  fs.mkdirSync(INDEX_DIR, { recursive: true });
}

/* =====================================================
CHECK PRODUCT INDEX
===================================================== */

if (!fs.existsSync(PRODUCT_INDEX_FILE)) {

  console.error("ERROR: product_index.json not found.");
  console.error("Please run buildProductIndex.js first.");

  process.exit(1);

}

/* =====================================================
LOAD PRODUCT INDEX
===================================================== */

let products = [];

try {

  products = JSON.parse(
    fs.readFileSync(PRODUCT_INDEX_FILE, "utf8")
  );

} catch (err) {

  console.error("ERROR: Failed to load product_index.json");
  console.error(err.message);

  process.exit(1);

}

/* =====================================================
TOKENIZER
===================================================== */

function tokenize(text) {

  if (!text) return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);

}

/* =====================================================
AUTOMOTIVE NORMALIZATION
===================================================== */

function normalize(text) {

  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/corola/g, "corolla")
    .replace(/civc/g, "civic")
    .replace(/break/g, "brake")
    .replace(/miror/g, "mirror")
    .replace(/bumpr/g, "bumper")
    .replace(/filtr/g, "filter");

}

/* =====================================================
BUILD SEARCH INDEX
===================================================== */

const SEARCH_INDEX = {};

for (const product of products) {

  let fields = [

    product.title || "",
    product.vendor || "",
    product.type || "",
    (product.tags || []).join(" ")

  ].join(" ");

  fields = normalize(fields);

  const tokens = tokenize(fields);

  const payload = {

    id: product.id,
    title: product.title,
    handle: product.handle

  };

  for (const token of tokens) {

    if (!SEARCH_INDEX[token]) {
      SEARCH_INDEX[token] = [];
    }

    SEARCH_INDEX[token].push(payload);

  }

}

/* =====================================================
SAVE SEARCH INDEX
===================================================== */

try {

  fs.writeFileSync(
    SEARCH_INDEX_FILE,
    JSON.stringify(SEARCH_INDEX, null, 2)
  );

} catch (err) {

  console.error("ERROR: Failed to write search_index.json");
  console.error(err.message);

  process.exit(1);

}

/* =====================================================
SUCCESS LOG
===================================================== */

console.log("Search index built successfully.");
console.log("Products indexed:", products.length);
console.log("Index file:", SEARCH_INDEX_FILE);
