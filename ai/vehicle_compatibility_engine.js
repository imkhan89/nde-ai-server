const fs = require("fs")
const path = require("path")

let fitment = []

try{

const filePath = path.join(__dirname,"../data/product_fitment.json")

const raw = fs.readFileSync(filePath,"utf8")

fitment = JSON.parse(raw)

console.log("Vehicle fitment database loaded")

}catch(err){

console.log("Vehicle fitment load error:",err.message)

}

function checkCompatibility(vehicle, part){

vehicle = vehicle.toLowerCase()
part = part.toLowerCase()

const matches = fitment.filter(item => {

const v = (item.vehicle || "").toLowerCase()
const p = (item.part || "").toLowerCase()

return v.includes(vehicle) && p.includes(part)

})

return matches

}

module.exports = {
checkCompatibility
}
