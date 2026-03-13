const productSearch = require("./product_search_engine")
const parser = require("./vehicle_query_parser")
const knowledge = require("./automotive_knowledge_engine")
const learning = require("./self_learning_engine")
const recommender = require("./recommendation_engine")
const orderEngine = require("./shopify_order_engine")
const vehicleMemory = require("./vehicle_memory_engine")
const insights = require("./customer_insight_engine")
const complaints = require("./complaint_engine")

async function handleMessage(message,phone){

try{

learning.learn(message)

insights.trackChat(phone,message)

const text = message.toLowerCase()

/* COMPLAINT DETECTION */

if(complaints.isComplaint(text)){

complaints.saveComplaint(phone,message)

return `
Your complaint has been registered.

Our support team will review it shortly.

You may also contact a live agent:

WhatsApp: +92 308 7643288
`

}

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

reply += `\n\nNeed help?\nLive Agent: +92 308 7643288`

return reply

}

return "Sorry, order not found.\n\nLive Agent: +92 308 7643288"

}

}

const savedVehicle = vehicleMemory.getCustomerVehicle(phone)

const parsed = parser.parseVehicleQuery(message)

if(savedVehicle && !parsed.make){

parsed.make = savedVehicle.make
parsed.model = savedVehicle.model
parsed.year = savedVehicle.year

}

if(parsed.make && parsed.model){

vehicleMemory.saveCustomerVehicle(phone,{
make: parsed.make,
model: parsed.model,
year: parsed.year
})

}

const searchQuery = parsed.part || message

insights.trackDemand(searchQuery)

const search = productSearch.searchProducts(searchQuery)

let reply = ""

const vehicleInfo =
knowledge.findVehicleInfo(
parsed.make,
parsed.model,
parsed.year
)

if(vehicleInfo){

reply += `Vehicle: ${parsed.make} ${parsed.model} ${parsed.year || ""}\n`

if(vehicleInfo.engine){
reply += `Engine: ${vehicleInfo.engine}\n`
}

reply += "\n"

}

if(search.success){

reply += "Matching Products:\n\n"

search.products.forEach((product,index)=>{

reply += `${index+1}. ${product.title}\n${product.url}\n\n`

})

const recommendations =
recommender.getRecommendations(searchQuery)

if(recommendations.length > 0){

reply += "Recommended Add-Ons:\n"

recommendations.forEach(item=>{
reply += `• ${item}\n`
})

}

reply += `\nNeed assistance?\nLive Agent: +92 308 7643288`

return reply

}

return `No matching products found.

You may contact a live agent:

WhatsApp +92 308 7643288`

}catch(err){

console.log("Chat handler error:",err.message)

return `System error occurred.

Please contact a live agent:
+92 308 7643288`

}

}

module.exports = {
handleMessage
}
