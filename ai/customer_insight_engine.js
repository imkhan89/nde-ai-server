const fs = require("fs")
const path = require("path")

const FILE = path.join(__dirname,"../data/customer_behavior.json")

function load(){

if(!fs.existsSync(FILE)){
fs.writeFileSync(FILE,"{}")
}

try{
return JSON.parse(fs.readFileSync(FILE,"utf8"))
}catch(e){
return {}
}

}

function save(data){

fs.writeFileSync(FILE,JSON.stringify(data,null,2))

}

function trackChat(phone,message){

const db = load()

const today = new Date().toISOString().slice(0,10)

if(!db.dailyChats){
db.dailyChats = {}
}

if(!db.dailyChats[today]){
db.dailyChats[today] = 0
}

db.dailyChats[today]++

if(!db.customers){
db.customers = {}
}

if(!db.customers[phone]){
db.customers[phone] = {
messages:0,
lastSeen:"",
queries:[]
}
}

db.customers[phone].messages++
db.customers[phone].lastSeen = today
db.customers[phone].queries.push(message)

save(db)

}

function trackDemand(part){

const db = load()

if(!db.productDemand){
db.productDemand = {}
}

if(!db.productDemand[part]){
db.productDemand[part] = 0
}

db.productDemand[part]++

save(db)

}

function report(){

const db = load()

return db

}

module.exports = {
trackChat,
trackDemand,
report
}
