const fs = require("fs")
const path = require("path")

const memoryFile = path.join(__dirname,"../data/customer_vehicle_memory.json")

function ensureFile(){

if(!fs.existsSync(memoryFile)){
fs.writeFileSync(memoryFile,"{}")
}

}

function loadMemory(){

ensureFile()

try{

const raw = fs.readFileSync(memoryFile,"utf8")

return JSON.parse(raw)

}catch(err){

console.log("Vehicle memory load error:",err.message)

return {}

}

}

function saveMemory(data){

fs.writeFileSync(memoryFile,JSON.stringify(data,null,2))

}

function saveCustomerVehicle(phone,vehicle){

const memory = loadMemory()

memory[phone] = vehicle

saveMemory(memory)

}

function getCustomerVehicle(phone){

const memory = loadMemory()

if(memory[phone]){
return memory[phone]
}

return null

}

function clearCustomerVehicle(phone){

const memory = loadMemory()

if(memory[phone]){
delete memory[phone]
saveMemory(memory)
}

}

module.exports = {
saveCustomerVehicle,
getCustomerVehicle,
clearCustomerVehicle
}
