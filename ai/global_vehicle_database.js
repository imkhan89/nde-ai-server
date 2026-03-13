const fs = require("fs")
const path = require("path")

const VEHICLE_DB_PATH =
path.join(__dirname,"../data/global_vehicle_database.json")

let vehicleDB = []

function loadVehicleDatabase(){

try{

if(!fs.existsSync(VEHICLE_DB_PATH)){

console.log("Global vehicle database not found")

vehicleDB = []

return

}

const raw = fs.readFileSync(VEHICLE_DB_PATH)

vehicleDB = JSON.parse(raw)

console.log("Global vehicle database loaded")

}catch(err){

console.log("Vehicle database load error:",err.message)

vehicleDB = []

}

}

function normalize(text){

if(!text) return ""

return text.toLowerCase().trim()

}

function detectVehicle(make,model,year){

if(!make || !model) return null

const mMake = normalize(make)
const mModel = normalize(model)

for(let v of vehicleDB){

const dbMake = normalize(v.make)
const dbModel = normalize(v.model)

if(dbMake !== mMake) continue
if(dbModel !== mModel) continue

if(year){

const y = parseInt(year)

if(y >= v.start_year && y <= v.end_year){

return v

}

}else{

return v

}

}

return null

}

function getAllVehicles(){

return vehicleDB

}

module.exports = {

loadVehicleDatabase,
detectVehicle,
getAllVehicles

}
