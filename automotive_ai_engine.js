const detectVehicle = require("./vehicle_detection_engine");
const detectAlias = require("./vehicle_alias_engine");
const fuzzyMatchPart = require("./fuzzy_parts_engine");

function normalize(text) {

return text
.toLowerCase()
.replace(/[^a-z0-9\s]/g,"")
.replace(/\s+/g," ")
.trim();

}

function extractYear(query){

const match = query.match(/\b(19|20)\d{2}\b/);

if(!match) return null;

return match[0];

}

function automotiveAI(query){

try {

if(!query || typeof query !== "string"){
return null;
}

const clean = normalize(query);

let vehicle = null;
let part = null;
let year = null;

/* VEHICLE DETECTION */

try {

vehicle = detectVehicle(clean);

if(!vehicle){
vehicle = detectAlias(clean);
}

} catch(error){

console.error("Vehicle detection error:",error);

}

/* PART DETECTION */

try {

part = fuzzyMatchPart(clean);

} catch(error){

console.error("Part detection error:",error);

}

/* YEAR EXTRACTION */

year = extractYear(clean);

return {
vehicle,
part,
year
};

} catch(error){

console.error("Automotive AI error:",error);

return {
vehicle:null,
part:null,
year:null
};

}

}

module.exports = automotiveAI;
