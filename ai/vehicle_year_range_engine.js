/*
Vehicle Model Year Range Detection Engine
Matches customer year with Shopify vehicle ranges
*/

const VEHICLE_RANGES = {

"Suzuki Swift":[
"2021-2026",
"2017-2021"
],

"Honda City":[
"2014-2017",
"2017-2021"
],

"Honda Civic":[
"2016-2021",
"2022-2025"
],

"Toyota Corolla":[
"2014-2017",
"2017-2021"
],

"Toyota Yaris":[
"2020-2024"
],

"Suzuki Cultus":[
"2017-2023"
],

"Suzuki Alto":[
"2019-2024"
],

"Suzuki Wagonr":[
"2014-2023"
],

"Kia Sportage":[
"2019-2024"
],

"Hyundai Tucson":[
"2020-2024"
]

}

/* CHECK YEAR IN RANGE */

function inRange(year,range){

const parts = range.split("-")

const start = parseInt(parts[0])
const end = parseInt(parts[1])

return year >= start && year <= end

}

/* FIND RANGE */

function detectVehicleRange(make,model,year){

if(!year) return ""

const key = `${make} ${model}`

const ranges = VEHICLE_RANGES[key]

if(!ranges) return year

for(const r of ranges){

if(inRange(year,r)){
return r
}

}

return year

}

module.exports = detectVehicleRange
