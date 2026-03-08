/* ======================================================
AUTOMOTIVE QUERY PARSER
Production Version
====================================================== */

const VEHICLES = require("./vehicle_database")
const PARTS = require("./parts_dictionary.json")

function normalize(text) {
return (text || "").toLowerCase().trim()
}

function detectVehicle(text) {

let found = null

for (let v of VEHICLES) {

const make = (v.make || "").toLowerCase()
const model = (v.model || "").toLowerCase()

if (text.includes(make) && text.includes(model)) {

found = {
make: v.make,
model: v.model,
generation: v.generation || null,
year_from: v.year_from || null,
year_to: v.year_to || null
}

break
}

}

return found
}

function detectPart(text) {

for (let part in PARTS) {

if (text.includes(part)) {
return part
}

let aliases = PARTS[part].aliases || []

for (let a of aliases) {
if (text.includes(a)) return part
}

}

return null
}

function parseQuery(query) {

const text = normalize(query)

const vehicle = detectVehicle(text)

const part = detectPart(text)

return {
query,
vehicle,
part
}

}

module.exports = {
parseQuery
}
