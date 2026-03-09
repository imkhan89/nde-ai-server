/* =====================================================
AUTOMOTIVE FITMENT ENGINE
Verifies product compatibility with vehicle
===================================================== */

const fs = require("fs")
const path = require("path")

const FITMENT_DB = path.join(__dirname,"data","product_fitment.json")

let FITMENTS=[]

try{

FITMENTS = JSON.parse(fs.readFileSync(FITMENT_DB,"utf8"))

}catch(e){

console.log("Fitment database not found")

}

/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
trim()

}

/* =====================================================
CHECK FITMENT
===================================================== */

function checkFitment(vehicle){

const make = normalize(vehicle.make)
const model = normalize(vehicle.model)
const generation = normalize(vehicle.generation)
const part = normalize(vehicle.part)

for(const item of FITMENTS){

if(

normalize(item.make) === make &&
normalize(item.model) === model &&
normalize(item.generation) === generation &&
normalize(item.part) === part

){

return item

}

}

return null

}

module.exports = {

checkFitment

}
