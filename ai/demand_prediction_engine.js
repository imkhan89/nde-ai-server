const fs = require("fs")
const path = require("path")

const behaviorFile = path.join(__dirname,"../data/customer_behavior.json")

function loadBehavior(){

try{

if(!fs.existsSync(behaviorFile)){
fs.writeFileSync(behaviorFile,"{}")
}

const raw = fs.readFileSync(behaviorFile,"utf8")

return JSON.parse(raw)

}catch(err){

console.log("Behavior load error:",err.message)

return {}

}

}

function getTopDemandProducts(limit = 10){

const data = loadBehavior()

if(!data.productDemand) return []

const sorted = Object.entries(data.productDemand)
.sort((a,b)=>b[1]-a[1])
.slice(0,limit)

return sorted.map(item=>({
product:item[0],
searches:item[1]
}))

}

function getCustomerActivity(){

const data = loadBehavior()

if(!data.customers) return []

return Object.keys(data.customers).map(phone=>({

phone:phone,
messages:data.customers[phone].messages,
lastSeen:data.customers[phone].lastSeen

}))

}

function getDailyChatStats(){

const data = loadBehavior()

if(!data.dailyChats) return {}

return data.dailyChats

}

module.exports = {
getTopDemandProducts,
getCustomerActivity,
getDailyChatStats
}
