/* =====================================================
AUTOMOTIVE FITMENT ENGINE
Verifies product compatibility
===================================================== */

const fs = require("fs")
const path = require("path")

const FITMENT_PATH = path.join(__dirname,"data","vehicle_fitment.json")

let FITMENTS=[]

try{

FITMENTS = JSON.parse(fs.readFileSync(FITMENT_PATH,"utf8"))

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
.trim()

}

/* =====================================================
CHECK FITMENT
===================================================== */

function checkFitment(data){

const make = normalize(data.make)
const model = normalize(data.model)
const generation = normalize(data.generation)
const part = normalize(data.part)

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
