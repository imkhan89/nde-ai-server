const shopifyVehicle =
require("./shopify_vehicle_learning_engine")

const detectRange =
require("./vehicle_year_range_engine")

function capitalize(text){

if(!text) return ""

return text
.split(" ")
.map(w => w.charAt(0).toUpperCase() + w.slice(1))
.join(" ")

}

/* BUILD SEARCH QUERY */

function buildSearchQuery(parsed){

if(!parsed) return null

let make = capitalize(parsed.make)
let model = capitalize(parsed.model)
let part = capitalize(parsed.part)

let year = parsed.year

let range = ""

/* FIRST TRY SHOPIFY LEARNED VEHICLE RANGES */

range = shopifyVehicle.detectRange(make,model)

/* IF NOT FOUND THEN USE STATIC RANGE ENGINE */

if(!range && year){

range = detectRange(
make,
model,
parseInt(year)
)

}

/* FALLBACK TO CUSTOMER YEAR */

if(!range && year){

range = year

}

/* BUILD QUERY */

let query = ""

if(range){

query =
`${part} for ${make} ${model} ${range}`

}else{

query =
`${part} for ${make} ${model}`

}

/* BUILD SHOPIFY SEARCH URL */

const url =
"https://www.ndestore.com/search?q=" +
encodeURIComponent(query)

/* RETURN RESULT */

return {

part: part,
make: make,
model: model,
year: year || "",
range: range || "",
query: query,
url: url

}

}

module.exports = buildSearchQuery
