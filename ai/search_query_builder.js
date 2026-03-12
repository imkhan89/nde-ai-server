const shopifyVehicle =
require("./shopify_vehicle_learning_engine")
const detectRange = require("./vehicle_year_range_engine")

function capitalize(text){

if(!text) return ""

return text
.split(" ")
.map(w => w.charAt(0).toUpperCase() + w.slice(1))
.join(" ")

}

function buildSearchQuery(parsed){

if(!parsed) return null

let make = capitalize(parsed.make)
let model = capitalize(parsed.model)
let part = capitalize(parsed.part)

let year = parsed.year

const range = detectRange(make,model,parseInt(year))

let query = ""

if(range){

query = `${part} for ${make} ${model} ${range}`

}else{

query = `${part} for ${make} ${model}`

}

const url =
"https://www.ndestore.com/search?q=" +
encodeURIComponent(query)

return {

part,
make,
model,
year,
range,
query,
url

}

}

module.exports = buildSearchQuery
