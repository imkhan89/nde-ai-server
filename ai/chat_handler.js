const productSearch = require("./product_search_engine")
const parser = require("./vehicle_query_parser")
const vehicleDetector = require("./vehicle_detector")
const knowledge = require("./automotive_knowledge_engine")

async function handleMessage(message){

try{

const parsed = parser.parseVehicleQuery(message)

const searchQuery = parsed.part || message

const search = productSearch.searchProducts(searchQuery)

let reply = ""

const vehicleInfo = knowledge.findVehicleInfo(parsed.make, parsed.model, parsed.year)

if(vehicleInfo){

reply += `Vehicle: ${parsed.make} ${parsed.model} ${parsed.year || ""}\n`

if(vehicleInfo.engine){
reply += `Engine: ${vehicleInfo.engine}\n`
}

reply += "\n"

}

if(search.success){

reply += "Here are matching products:\n\n"

search.products.forEach((product,index)=>{

reply += `${index+1}. ${product.title}\n${product.url}\n\n`

})

return reply

}

return "Sorry, no matching products found."

}catch(err){

console.log("Chat handler error:",err.message)

return "System error. Please try again."

}

}

module.exports = {
handleMessage
}
