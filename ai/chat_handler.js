const productSearch = require("./product_search_engine")
const parser = require("./vehicle_query_parser")
const knowledge = require("./automotive_knowledge_engine")
const learning = require("./self_learning_engine")
const recommender = require("./recommendation_engine")
const orderEngine = require("./shopify_order_engine")
const vehicleMemory = require("./vehicle_memory_engine")
const insights = require("./customer_insight_engine")
const complaints = require("./complaint_engine")
const liveAgent = require("./live_agent_forwarder")
const testEngine = require("./test_message_engine")
const serviceEngine = require("./smart_service_recommendation_engine")

function cleanUrl(url){

if(!url) return ""

let u = url.trim()

if(!u.startsWith("http")){
u = "https://www.ndestore.com" + u
}

u = u.replace("http://","https://")

return u

}

async function handleMessage(message,phone){

try{

testEngine.logTest(message,phone)

learning.learn(message)

insights.trackChat(phone,message)

const text = message.toLowerCase()

if(complaints.isComplaint(text)){

complaints.saveComplaint(phone,message)

liveAgent.forwardToAgent(phone,message)

return `
Your complaint has been registered.

Live Agent:
+92 308 7643288
`

}

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

return "Order not found."

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

reply += `Vehicle: ${parsed.make} ${parsed.model} ${parsed.year || ""}\n\n`

}

if(search.success){

reply += "Matching Products:\n\n"

search.products.forEach((product,index)=>{

const url = cleanUrl(product.url)

reply += `${index+1}. ${product.title}\n${url}\n\n`

})

const recommendations =
recommender.getRecommendations(searchQuery)

if(recommendations.length > 0){

reply += "Recommended Add-Ons:\n"

recommendations.forEach(item=>{
reply += `• ${item}\n`
})

reply += "\n"

}

const serviceKit =
serviceEngine.getServiceRecommendations(
parsed.part,
parsed.make,
parsed.model
)

if(serviceKit.length > 0){

reply += "Suggested Service Kit:\n"

serviceKit.forEach(p=>{

const url = cleanUrl(p.url)

reply += `• ${p.title}\n${url}\n`

})

reply += "\n"

}

reply += "Live Agent: +92 308 7643288"

return reply

}

liveAgent.forwardToAgent(phone,message)

return `
No exact match found.

Live Agent:
+92 308 7643288
`

}catch(err){

console.log("Chat handler error:",err.message)

return `
System error.

Live Agent:
+92 308 7643288
`

}

}

module.exports = {
handleMessage
}
