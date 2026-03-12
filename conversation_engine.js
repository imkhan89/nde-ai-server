const automotiveAI = require("./automotive_ai_engine")
const productSearch = require("./product_search_engine")

function buildVehicleText(vehicle){

if(!vehicle) return ""

let text = ""

if(vehicle.brand) text += vehicle.brand + " "
if(vehicle.model) text += vehicle.model + " "
if(vehicle.variant) text += vehicle.variant + " "

return text.trim()

}


function conversationEngine(message){

if(!message || typeof message !== "string"){

return {
reply:"Please send vehicle and required part.\n\nExample:\nCivic 2018 brake pads"
}

}

let ai = null

try{

ai = automotiveAI(message)

}catch(error){

console.error("AI engine error:",error)

return {
reply:"System processing error. Please try again."
}

}

if(!ai){

return {
reply:"Please provide vehicle and required part."
}

}

const vehicle = ai.vehicle || null
const part = ai.part || null
const year = ai.year || null

const vehicleText = buildVehicleText(vehicle)


/* =========================
NO DATA
========================= */

if(!vehicle && !part){

return {
reply:
"Please provide vehicle and required part.\n\nExample:\nCivic 2018 brake pads"
}

}


/* =========================
ONLY VEHICLE
========================= */

if(vehicle && !part){

return {
vehicle,
reply:
"Vehicle detected:\n"+
vehicleText+
"\n\nPlease tell the required part."
}

}


/* =========================
ONLY PART
========================= */

if(!vehicle && part){

return {
part,
reply:
"Part detected: "+
(part.name || part.part || "Part")+
"\n\nPlease provide vehicle details."
}

}


/* =========================
VEHICLE + PART
========================= */

if(vehicle && part){

const searchQuery = `${vehicle.brand} ${vehicle.model} ${part.name || part.part}`

let products = []

try{

products = productSearch.searchProducts(searchQuery)

}catch(e){

console.log("Product search error:",e.message)

}

if(!products || products.length === 0){

return {

vehicle,
part,
year,

reply:
"Vehicle: "+vehicleText+
"\nPart: "+(part.name || part.part)+
"\n\nSorry, no products found in inventory."

}

}


/* =========================
BUILD PRODUCT RESPONSE
========================= */

let reply =
"Vehicle: "+vehicleText+
"\nPart: "+(part.name || part.part)+
"\n\nAvailable Products:\n\n"

for(const p of products){

const url = productSearch.buildProductURL(p.handle)

reply +=
"• "+p.title+
"\nPKR "+(p.price || "")+
"\n"+url+
"\n\n"

}

return {

vehicle,
part,
year,
products,

reply

}

}


return {
reply:"Please provide vehicle and required part."
}

}

module.exports = conversationEngine
