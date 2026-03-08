const fs = require("fs")

/* Load dataset */

const raw = fs.readFileSync("vehicle_list.txt","utf8")
.split("\n")
.map(v => v.trim())
.filter(v => v.length > 0)

/* Storage */

const vehicles = []

let currentMake = null

raw.forEach(line => {

line = line.trim()

/* Detect MAKE (TOYOTA, HONDA etc) */

if(line === line.toUpperCase() && !line.includes("(") && line.length < 20){

currentMake = line
return

}

/* Detect YEAR RANGE */

const yearMatch = line.match(/\((\d{4})-(\d{4}|ONWARD|ONWARDS)\)/)

if(yearMatch){

const yearStart = parseInt(yearMatch[1])
let yearEnd = yearMatch[2]

if(yearEnd === "ONWARD" || yearEnd === "ONWARDS"){
yearEnd = 2026
}

yearEnd = parseInt(yearEnd)

/* Extract model */

const model = line
.replace(/\(.+\)/,"")
.replace(currentMake,"")
.trim()

vehicles.push({
make: currentMake,
model: model,
year_start: yearStart,
year_end: yearEnd,
show_year_menu: true
})

}else{

/* No year case */

if(line.includes(currentMake)){

const model = line.replace(currentMake,"").trim()

vehicles.push({
make: currentMake,
model: model,
year_start: 2000,
year_end: 2026,
show_year_menu: false
})

}

}

})

/* Save output */

fs.writeFileSync(
"./data/vehicle_database.js",
"const vehicles = " + JSON.stringify(vehicles,null,2) + ";\n\nmodule.exports = { vehicles };"
)

console.log("Vehicle dataset created")
console.log("Total vehicles:", vehicles.length)
