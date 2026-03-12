const detectVehicle = require("./vehicle_intelligence_engine")

function capitalize(text){

if(!text) return ""

return text
.split(" ")
.map(w => w.charAt(0).toUpperCase() + w.slice(1))
.join(" ")

}

function buildSearchQuery(parsed){

if(!parsed) return null

const vehicle = detectVehicle(
`${parsed.make} ${parsed.model} ${parsed.year}`
)

let make = parsed.make
let model = parsed.model
let year = parsed.year

if(vehicle){

make = vehicle.make
model = vehicle.model
year = vehicle.range || vehicle.year

}

const part = capitalize(parsed.part)

let query = ""

if(year){

query = `${part} for ${make} ${model} ${year}`

}else{

query = `${part} for ${make} ${model}`

}

const url =
"https://www.ndestore.com/search?q=" +
encodeURIComponent(query)

return {

part: part,
make: make,
model: model,
year: parsed.year || "",
range: year,
query: query,
url: url

}

}

module.exports = buildSearchQuery
