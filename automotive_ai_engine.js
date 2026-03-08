const { vehicles: VEHICLE_DB } = require("./data/vehicle_database")
const GENERATIONS = require("./data/vehicle_generations")

const { learnQuery } = require("./learning_engine")
const { resolveVehicle } = require("./fitment_engine")

const parse = require("./data/parser")
const { GLOBAL_PART_INDEX } = require("./data/automotive_intelligence")

function normalizeText(text){

return text
.toLowerCase()
.replace(/\+/g," ")
.replace(/-/g," ")
.replace(/\//g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

function detectGeneration(make,model,year,text){

for(const g of GENERATIONS){

if(g.make.toLowerCase()!==make) continue
if(g.model.toLowerCase()!==model) continue

if(g.aliases){

for(const a of g.aliases){

if(text.includes(a.toLowerCase())){

return g

}

}

}

if(year && g.years.includes(year)){

return g

}

}

return null

}

function buildSearchURL(query){

return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}`

}

function cap(str){

if(!str) return "Not Specified"

return str
.split(" ")
.map(w=>w.charAt(0).toUpperCase()+w.slice(1))
.join(" ")

}

function analyzeAutomotiveQuery(message){

try{

let clean = normalizeText(message)

learnQuery(clean)

const parsed = parse(clean, GLOBAL_PART_INDEX)

let vehicle = parsed.vehicle || {make:"",model:""}

const year = parsed.year
const part = parsed.part
const application = parsed.position

const aliasVehicle = resolveVehicle(clean)

if(aliasVehicle && !vehicle.model){

vehicle.make = aliasVehicle.make
vehicle.model = aliasVehicle.model

}

let generation = detectGeneration(vehicle.make,vehicle.model,year,clean)

const query=[
application,
part,
vehicle.make,
vehicle.model,
year
]
.filter(Boolean)
.join(" ")

return{

make:cap(vehicle.make),
model:cap(vehicle.model),
generation:generation ? generation.generation : "Not Specified",
year:year || "Not Specified",
part:cap(part),
application:cap(application),
query,
url:buildSearchURL(query)

}

}catch(err){

console.error("AI ERROR",err)

return{

make:"Not Specified",
model:"Not Specified",
generation:"Not Specified",
year:"Not Specified",
part:"Not Specified",
application:"Not Specified",
query:message,
url:buildSearchURL(message)

}

}

}

module.exports={ analyzeAutomotiveQuery }
