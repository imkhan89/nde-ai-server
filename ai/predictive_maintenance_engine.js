const fs = require("fs")
const path = require("path")

const MAINTENANCE_DB_PATH =
path.join(__dirname,"../data/maintenance_schedule.json")

let maintenanceDB = []

function loadMaintenanceDatabase(){

try{

if(!fs.existsSync(MAINTENANCE_DB_PATH)){

console.log("Maintenance schedule database not found")

maintenanceDB = []

return

}

const raw = fs.readFileSync(MAINTENANCE_DB_PATH)

maintenanceDB = JSON.parse(raw)

console.log("Predictive maintenance database loaded")

}catch(err){

console.log("Maintenance DB load error:",err.message)

maintenanceDB = []

}

}

function normalize(text){

if(!text) return ""

return text.toLowerCase().trim()

}

function getMaintenanceRecommendations(vehicle,mileage){

if(!vehicle || !mileage){

return null

}

const make = normalize(vehicle.make)
const model = normalize(vehicle.model)

const km = parseInt(mileage)

if(isNaN(km)) return null

let recommendations = []

for(let item of maintenanceDB){

const dbMake = normalize(item.make)
const dbModel = normalize(item.model)

if(dbMake !== make) continue
if(dbModel !== model) continue

for(let service of item.services){

const interval = parseInt(service.interval_km)

if(isNaN(interval)) continue

if(km >= interval){

recommendations.push({
part:service.part,
interval:interval
})

}

}

}

return recommendations

}

function buildMaintenanceMessage(vehicle,mileage){

const rec = getMaintenanceRecommendations(vehicle,mileage)

if(!rec || !rec.length){

return null

}

let message = "Recommended Maintenance Parts\n\n"

rec.slice(0,5).forEach((r,index)=>{

message += (index+1)+". "+r.part+" (Service Interval "+r.interval+" km)\n"

})

return message

}

module.exports = {

loadMaintenanceDatabase,
getMaintenanceRecommendations,
buildMaintenanceMessage

}
