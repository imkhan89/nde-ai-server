const Fuse = require("./fuse");
const fs = require("fs");
const path = require("path");

const partsPath = path.join(__dirname, "data", "parts_dictionary.json");

let parts = [];

/* =========================
LOAD PARTS DICTIONARY
========================= */

try {

if (fs.existsSync(partsPath)) {

const raw = fs.readFileSync(partsPath, "utf8");
const parsed = JSON.parse(raw);

parts = Array.isArray(parsed) ? parsed : [];

} else {

console.log("parts_dictionary.json not found. Using empty list.");

}

} catch (error) {

console.error("Parts dictionary load error:", error);
parts = [];

}

/* =========================
NORMALIZE TEXT
========================= */

function normalize(text) {

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9\s]/g," ")
.replace(/\s+/g," ")
.trim();

}

/* =========================
EXPAND ALIASES
========================= */

function expandPartsDictionary(list){

const expanded = [];

for(const item of list){

if(typeof item === "string"){

expanded.push({ name:item });
continue;

}

expanded.push(item);

if(item.aliases && Array.isArray(item.aliases)){

for(const alias of item.aliases){

expanded.push({
...item,
name:alias
});

}

}

}

return expanded;

}

const expandedParts = expandPartsDictionary(parts);

/* =========================
INITIALIZE FUSE
========================= */

let fuse = null;

try {

if(expandedParts.length){

fuse = new Fuse(expandedParts,{
includeScore:true,
threshold:0.32,
keys:["name","part","keyword","keywords","alias","aliases"]
});

} else {

console.log("Fuse disabled. No parts loaded.");

}

} catch(error){

console.error("Fuse initialization failed:",error);

}

/* =========================
FUZZY MATCH FUNCTION
========================= */

function fuzzyMatchPart(query){

if(!query || typeof query !== "string"){
return null;
}

if(!fuse){
return null;
}

const cleanQuery = normalize(query);

if(!cleanQuery){
return null;
}

try {

const results = fuse.search(cleanQuery);

if(!results || !results.length){
return null;
}

return results[0].item;

} catch(error){

console.error("Fuzzy search error:",error);
return null;

}

}

module.exports = fuzzyMatchPart;
