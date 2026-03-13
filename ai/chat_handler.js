const productSearch = require("./product_search_engine")
const parser = require("./vehicle_query_parser")
const knowledge = require("./automotive_knowledge_engine")
const learning = require("./self_learning_engine")
const recommender = require("./recommendation_engine")
const orderEngine = require("./shopify_order_engine")
const vehicleMemory = require("./vehicle_memory_engine")

async function handleMessage(message, phone){

try{

learning.learn(message)

const text = message.toLowerCase()

/* LOAD SAVED VEHICLE */

const savedVehicle = vehicleMemory.getCustomerVehicle(phone)

/* ORDER STATUS */

if(text.includes("order")){

const orderMatch = message.match(/\d+/)

if(orderMatch){

const order = await orderEngine.getOrder(orderMatch[0])

if(order){

let reply = `Order ${order.name}\n`
reply += `Payment: ${order.financial}\n`
reply += `Status: ${order.status}\n`

if(order.tracking && order.tracking.length > 0){
reply += `Tracking: ${order.tracking.join(", ")}`
}

return reply

}

return "Sorry, order not found."

}

}

/* PRODUCT SEARCH */

const parsed = parser.parseVehicleQuery(message)

/* APPLY SAVED VEHICLE */

if(savedVehicle && !parsed.make){

parsed.make = savedVehicle.make
parsed.model = savedVehicle.model
parsed.year = savedVehicle.year

}

/* SAVE VEHICLE IF DETECTED */

if(parsed.make && parsed.model){

vehicleMemory.saveCustomerVehicle(phone,{
make: parsed.make,
model: parsed.model,
year: parsed.year
})

}

const searchQuery = parsed.part || message

const search = productSearch.searchProducts(searchQuery)

let reply = ""

const vehicleInfo = knowledge.findVehicleInfo(parsed.make,parsed.model,parsed.year)

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

const recommendations = recommender.getRecommendations(searchQuery)

if(recommendations.length > 0){

reply += "Recommended Add-Ons:\n"

recommendations.forEach(item=>{
reply += `• ${item}\n`
})

}

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
