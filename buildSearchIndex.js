const fs = require("fs");

const products = JSON.parse(
fs.readFileSync("products_index.json")
);

let SEARCH_INDEX = {};

function tokenize(text){

return text
.toLowerCase()
.replace(/[^a-z0-9 ]/g,"")
.split(" ")
.filter(w=>w.length>2);

}

for(const product of products){

const fields = [
product.title,
product.tags,
product.type,
product.vendor
].join(" ");

const tokens = tokenize(fields);

for(const token of tokens){

if(!SEARCH_INDEX[token])
SEARCH_INDEX[token] = [];

SEARCH_INDEX[token].push(product);

}

}

fs.writeFileSync(
"search_index.json",
JSON.stringify(SEARCH_INDEX,null,2)
);

console.log("Search index created");
