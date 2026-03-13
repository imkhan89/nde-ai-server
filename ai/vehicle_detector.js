const fs = require("fs")
const path = require("path")

let vehicles = []

try{

const filePath = path.join(__dirname,"../data/vehicle_graph.json")

const raw = fs.readFileSync(filePath,"utf8")

vehicles = JSON.parse(raw)

console.log("Vehicle database loaded")

}catch(err){

console.log("Vehicle database load error:",err.message)

}

function detectVehicle(text){

text = text.toLowerCase()

let detected = null

vehicles.forEach(v => {

const make = (v.make || "").toLowerCase()
const model = (v.model || "").toLowerCase()

if(text.includes(make) && text.includes(model)){
detected = v
}

})

return detected

}

module.exports = {
detectVehicle
}
