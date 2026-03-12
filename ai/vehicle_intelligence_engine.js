/*
Vehicle Intelligence Engine
ndestore Automotive AI System
Detects Make, Model, and Year Range
*/

const VEHICLE_DATABASE = [

{
make:"Suzuki",
models:[
{name:"Swift",range:"2021-2026"},
{name:"Swift",range:"2017-2021"},
{name:"Cultus",range:"2017-2023"},
{name:"Alto",range:"2019-2024"},
{name:"Wagonr",range:"2014-2023"}
]
},

{
make:"Toyota",
models:[
{name:"Corolla",range:"2014-2017"},
{name:"Corolla",range:"2017-2021"},
{name:"Yaris",range:"2020-2024"},
{name:"Hilux",range:"2016-2024"},
{name:"Revo",range:"2016-2024"}
]
},

{
make:"Honda",
models:[
{name:"City",range:"2014-2017"},
{name:"City",range:"2017-2021"},
{name:"Civic",range:"2016-2021"},
{name:"Civic",range:"2022-2025"}
]
},

{
make:"Kia",
models:[
{name:"Sportage",range:"2019-2024"},
{name:"Picanto",range:"2019-2024"}
]
},

{
make:"Hyundai",
models:[
{name:"Tucson",range:"2020-2024"},
{name:"Elantra",range:"2021-2024"}
]
},

{
make:"Mg",
models:[
{name:"Hs",range:"2021-2024"},
{name:"Zs",range:"2021-2024"}
]
}

]

/* NORMALIZE TEXT */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* CAPITALIZE */

function capitalize(text){

if(!text) return ""

return text
.split(" ")
.map(w => w.charAt(0).toUpperCase() + w.slice(1))
.join(" ")

}

/* DETECT YEAR */

function detectYear(text){

const match = text.match(/\b(19|20)\d{2}\b/)

if(match){
return parseInt(match[0])
}

return null

}

/* CHECK YEAR RANGE */

function withinRange(year,range){

if(!year) return true

const parts = range.split("-")

const start = parseInt(parts[0])
const end = parseInt(parts[1])

return year >= start && year <= end

}

/* DETECT VEHICLE */

function detectVehicle(message){

const clean = normalize(message)

const year = detectYear(clean)

for(const brand of VEHICLE_DATABASE){

if(clean.includes(brand.make.toLowerCase())){

for(const m of brand.models){

if(clean.includes(m.name.toLowerCase())){

if(withinRange(year,m.range)){

return {

make:capitalize(brand.make),
model:capitalize(m.name),
range:m.range,
year:year || ""

}

}

}

}

}

}

return null

}

/* EXPORT */

module.exports = detectVehicle
