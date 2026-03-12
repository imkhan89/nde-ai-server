const shopifyVehicle =
require("./shopify_vehicle_learning_engine")

const webVehicle =
require("./vehicle_web_learning_engine")

const detectRange =
require("./vehicle_year_range_engine")

/* CAPITALIZE WORDS */

function capitalize(text){

if(!text) return ""

return text
.split(" ")
.map(w => w.charAt(0).toUpperCase() + w.slice(1))
.join(" ")

}

/* BUILD SHOPIFY SEARCH QUERY */

function buildSearchQuery(parsed){

if(!parsed) return null

let make = capitalize(parsed.make)
let model = capitalize(parsed.model)
let part = capitalize(parsed.part)

let year = parsed.year

let range = ""

/* 1️⃣ SHOPIFY LEARNED VEHICLE RANGE */

range = shopifyVehicle.detectRange(make,model)

/* 2️⃣ WEBSITE LEARNED RANGE */

if(!range){

range = webVehicle.detectRange(make,model)

}

/* 3️⃣ STATIC RANGE ENGINE */

if(!range && year){

range = detectRange(
make,
model,
parseInt(year)
)

}

/* 4️⃣ FALLBACK TO CUSTOMER YEAR */

if(!range && year){

range = year

}

/* BUILD SEARCH QUERY */

let query = ""

if(range){

query =
`${part} for ${make} ${model} ${range}`

}else{

query =
`${part} for ${make} ${model}`

}

/* BUILD SHOPIFY URL */

const url =
"https://www.ndestore.com/search?q=" +
encodeURIComponent(query)

/* RETURN STRUCTURED RESULT */

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
