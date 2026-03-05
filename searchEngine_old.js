const fs = require("fs");

const INDEX = JSON.parse(
fs.readFileSync("./search_index.json")
);

function tokenize(text){

return text
.toLowerCase()
.replace(/[^a-z0-9 ]/g,"")
.split(" ")
.filter(w=>w.length>2);

}

function searchProducts(query){

const tokens = tokenize(query);

let results = [];

for(const token of tokens){

if(INDEX[token]){

results.push(...INDEX[token]);

}

}

const unique = {};
const final = [];

for(const r of results){

if(!unique[r.id]){

unique[r.id] = true;
final.push(r);

}

}

return final.slice(0,10);

}

module.exports = {searchProducts};
