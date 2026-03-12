const fs = require("fs");
const path = require("path");

let vehicles = [];

try {

const graphPath = path.join(__dirname, "data", "vehicle_graph.json");

if (fs.existsSync(graphPath)) {

  const raw = fs.readFileSync(graphPath, "utf8");
  const parsed = JSON.parse(raw);

  vehicles = parsed.vehicles || parsed;

} else {

  console.log("vehicle_graph.json not found. Using empty graph.");

}

} catch (error) {

console.error("Vehicle graph load error:", error);

vehicles = [];

}

function normalize(text) {

return text
.toLowerCase()
.replace(/[^a-z0-9\s]/g,"")
.replace(/\s+/g," ")
.trim();

}

function detectVehicle(query){

if(!query) return null;

const q = normalize(query);

for(const vehicle of vehicles){

const brand = vehicle.brand ? vehicle.brand.toLowerCase() : "";
const model = vehicle.model ? vehicle.model.toLowerCase() : "";
const variant = vehicle.variant ? vehicle.variant.toLowerCase() : "";

if(brand && model && q.includes(brand) && q.includes(model)){
return vehicle;
}

if(model && variant && q.includes(model) && q.includes(variant)){
return vehicle;
}

if(model && q.includes(model)){
return vehicle;
}

}

return null;

}

module.exports = detectVehicle;
