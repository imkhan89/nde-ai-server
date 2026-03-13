const productSearch = require("./product_search_engine")
const parser = require("./vehicle_query_parser")
const vehicleDetector = require("./vehicle_detector")
const compatibility = require("./vehicle_compatibility_engine")

async function handleMessage(message){

try{

const parsed = parser.parseVehicleQuery(message)

const vehicle = vehicleDetector.detectVehicle(message)

const searchQuery = parsed.part || message

const search = productSearch.searchProducts(searchQuery)

let reply = ""

if(vehicle){
reply += `Detected Vehicle: ${vehicle.make} ${vehicle.model}\n\n`
}

if(search.success){

reply += "Here are matching products:\n\n"

search.products.forEach((product,index)=>{

reply += `${index+1}. ${product.title}\n${product.url}\n\n`

})

return reply

}

const vehicleName = vehicle ? `${vehicle.make} ${vehicle.model}` : ""

const compatibilityCheck = compatibility.checkCompatibility(vehicleName,searchQuery)

if(compatibilityCheck.length > 0){

reply += "Compatible parts found:\n\n"

compatibilityCheck.forEach((item,index)=>{

reply += `${index+1}. ${item.part}\n`

})

return reply

}

return "Sorry, no compatible parts found."

}catch(err){

console.log("Chat handler error:",err.message)

return "System error. Please try again."

}

}

module.exports = {
handleMessage
}
