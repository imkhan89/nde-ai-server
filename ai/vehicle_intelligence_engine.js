const fs = require("fs")
const path = require("path")

const vehicleGraphFile = path.join(__dirname,"../data/vehicle_graph.json")

let vehicleGraph = {}

function ensureFile(){

if(!fs.existsSync(vehicleGraphFile)){
fs.writeFileSync(vehicleGraphFile,"{}")
}

}

function loadGraph(){

ensureFile()

try{

const raw = fs.readFileSync(vehicleGraphFile,"utf8")

vehicleGraph = JSON.parse(raw)

console.log("Vehicle intelligence graph loaded")

}catch(err){

console.log("Vehicle graph load error:",err.message)

vehicleGraph = {}

}

}

function saveGraph(){

fs.writeFileSync(vehicleGraphFile,JSON.stringify(vehicleGraph,null,2))

}

function learnVehicle(make,model,year){

if(!make || !model) return

const key = `${make}_${model}`

if(!vehicleGraph[key]){
vehicleGraph[key] = {
make:make,
model:model,
years:[]
}
}

if(year && !vehicleGraph[key].years.includes(year)){
vehicleGraph[key].years.push(year)
}

saveGraph()

}

function getVehicleYears(make,model){

const key = `${make}_${model}`

if(vehicleGraph[key]){
return vehicleGraph[key].years
}

return []

}

function expandVehicleYears(make,model){

const years = getVehicleYears(make,model)

let expanded = []

years.forEach(y=>{

if(typeof y === "string" && y.includes("-")){

const parts = y.split("-")

const start = parseInt(parts[0])
const end = parseInt(parts[1])

for(let i=start;i<=end;i++){
expanded.push(i)
}

}else{

expanded.push(parseInt(y))

}

})

return expanded

}

loadGraph()

module.exports = {
learnVehicle,
getVehicleYears,
expandVehicleYears
}
