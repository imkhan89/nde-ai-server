const fs = require("fs")
const path = require("path")

const fitmentPath =
path.join(__dirname,"../data/product_fitment.json")

let fitmentDB = []

function loadFitmentDatabase(){

try{

if(!fs.existsSync(fitmentPath)){

console.log("Fitment database not found")
fitmentDB = []
return

}

const raw = fs.readFileSync(fitmentPath)

fitmentDB = JSON.parse(raw)

console.log("Fitment database loaded")

}catch(err){

console.log("Fitment DB load error:",err.message)
fitmentDB = []

}

}

function predictCompatibility(productTitle,vehicle){

if(!vehicle) return false

const title = productTitle.toLowerCase()

const make = vehicle.make.toLowerCase()
const model = vehicle.model.toLowerCase()

if(title.includes(make) && title.includes(model)){
return true
}

return false

}

function predictVehiclesForProduct(productTitle){

let matches = []

fitmentDB.forEach(f=>{

const make = f.make.toLowerCase()
const model = f.model.toLowerCase()

if(productTitle.toLowerCase().includes(make) &&
productTitle.toLowerCase().includes(model)){

matches.push(f)

}

})

return matches

}

function checkVehicleCompatibility(productTitle,vehicle){

if(!vehicle) return false

const exact = predictCompatibility(productTitle,vehicle)

if(exact) return true

const predicted = predictVehiclesForProduct(productTitle)

if(!predicted.length) return false

for(let p of predicted){

if(
p.make.toLowerCase() === vehicle.make.toLowerCase() &&
p.model.toLowerCase() === vehicle.model.toLowerCase()
){
return true
}

}

return false

}

module.exports = {

loadFitmentDatabase,
predictCompatibility,
predictVehiclesForProduct,
checkVehicleCompatibility

}
