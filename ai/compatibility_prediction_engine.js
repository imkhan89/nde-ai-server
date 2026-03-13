const fs = require("fs")
const path = require("path")

const FITMENT_DB_PATH =
path.join(__dirname,"../data/product_fitment.json")

let fitmentDB = []

function loadFitmentDatabase(){

try{

if(!fs.existsSync(FITMENT_DB_PATH)){

console.log("Fitment database not found")

fitmentDB = []

return

}

const raw = fs.readFileSync(FITMENT_DB_PATH)

fitmentDB = JSON.parse(raw)

console.log("Fitment database loaded")

}catch(err){

console.log("Fitment database load error:",err.message)

fitmentDB = []

}

}

function normalize(text){

if(!text) return ""

return text.toLowerCase().trim()

}

function matchYear(vehicleYear,startYear,endYear){

if(!vehicleYear) return true

const y = parseInt(vehicleYear)

const s = parseInt(startYear)

const e = parseInt(endYear)

if(isNaN(y) || isNaN(s) || isNaN(e)) return true

return y >= s && y <= e

}

function predictCompatibility(productTitle,vehicle){

if(!vehicle) return false

const title = normalize(productTitle)

const make = normalize(vehicle.make)

const model = normalize(vehicle.model)

const year = vehicle.year

for(let fit of fitmentDB){

const fMake = normalize(fit.make)

const fModel = normalize(fit.model)

if(fMake !== make) continue

if(fModel !== model) continue

if(!matchYear(year,fit.start_year,fit.end_year)) continue

if(title.includes(make) && title.includes(model)){

return true

}

}

return false

}

function getCompatibleVehicles(productTitle){

const title = normalize(productTitle)

let matches = []

for(let fit of fitmentDB){

const make = normalize(fit.make)

const model = normalize(fit.model)

if(title.includes(make) && title.includes(model)){

matches.push(fit)

}

}

return matches

}

function checkVehicleCompatibility(productTitle,vehicle){

if(!vehicle) return false

if(predictCompatibility(productTitle,vehicle)){

return true

}

const predictions = getCompatibleVehicles(productTitle)

for(let p of predictions){

if(
normalize(p.make) === normalize(vehicle.make) &&
normalize(p.model) === normalize(vehicle.model)
){

if(matchYear(vehicle.year,p.start_year,p.end_year)){

return true

}

}

}

return false

}

module.exports = {

loadFitmentDatabase,
predictCompatibility,
getCompatibleVehicles,
checkVehicleCompatibility

}
