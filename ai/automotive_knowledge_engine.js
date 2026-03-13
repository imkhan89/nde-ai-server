const fs = require("fs")
const path = require("path")

let vehicleDB = []

try{

const filePath = path.join(__dirname,"../data/vehicle_database.js")

vehicleDB = require(filePath)

console.log("Automotive knowledge database loaded")

}catch(err){

console.log("Vehicle database load error:",err.message)

}

function findVehicleInfo(make, model, year){

make = (make || "").toLowerCase()
model = (model || "").toLowerCase()

const result = vehicleDB.find(v => {

const m = (v.make || "").toLowerCase()
const md = (v.model || "").toLowerCase()

return m === make && md === model

})

if(!result){
return null
}

if(year){

const y = parseInt(year)

if(result.years){

const match = result.years.find(r => y >= r.start && y <= r.end)

if(match){
return match
}

}

}

return result

}

module.exports = {
findVehicleInfo
}
