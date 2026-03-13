const fs = require("fs")
const path = require("path")

const CUSTOMER_BEHAVIOR_PATH =
path.join(__dirname,"../data/customer_behavior.json")

let customerDB = []

function loadCustomerBehavior(){

try{

if(!fs.existsSync(CUSTOMER_BEHAVIOR_PATH)){

console.log("Customer behavior database not found")

customerDB = []

return

}

const raw = fs.readFileSync(CUSTOMER_BEHAVIOR_PATH)

customerDB = JSON.parse(raw)

console.log("Customer behavior database loaded")

}catch(err){

console.log("Customer DB load error:",err.message)

customerDB = []

}

}

function normalize(text){

if(!text) return ""

return text.toLowerCase().trim()

}

function getCustomer(phone){

return customerDB.find(c=>c.phone===phone)

}

function saveCustomer(customer){

const index = customerDB.findIndex(c=>c.phone===customer.phone)

if(index===-1){

customerDB.push(customer)

}else{

customerDB[index] = customer

}

fs.writeFileSync(
CUSTOMER_BEHAVIOR_PATH,
JSON.stringify(customerDB,null,2)
)

}

function trackSearch(phone,query){

let customer = getCustomer(phone)

if(!customer){

customer = {
phone:phone,
searches:[],
purchases:[]
}

}

customer.searches.push({
query:query,
time:Date.now()
})

saveCustomer(customer)

}

function getRecommendations(vehicle){

if(!vehicle) return []

const make = normalize(vehicle.make)
const model = normalize(vehicle.model)

let recommendations = []

const serviceParts = [
"Engine Oil",
"Oil Filter",
"Air Filter",
"Cabin AC Filter",
"Spark Plugs"
]

serviceParts.forEach(p=>{

recommendations.push({
part:p,
vehicle:make+" "+model
})

})

return recommendations

}

function buildRecommendationMessage(vehicle){

const rec = getRecommendations(vehicle)

if(!rec.length){

return null

}

let message = "Recommended Parts\n\n"

rec.slice(0,5).forEach((r,index)=>{

message += (index+1)+". "+r.part+"\n"

})

return message

}

module.exports = {

loadCustomerBehavior,
trackSearch,
buildRecommendationMessage

}
