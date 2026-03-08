/* =====================================================
AUTOMOTIVE INTELLIGENCE ENGINE
===================================================== */

const VEHICLES = require("./vehicle_database")
const PARTS = require("./parts_dictionary.json")

function normalize(text) {
return (text || "").toLowerCase().trim()
}

function detectVehicle(query) {

for (const v of VEHICLES) {

const make = (v.make || "").toLowerCase()
const model = (v.model || "").toLowerCase()

if (query.includes(make) && query.includes(model)) {

return {
make: v.make,
model: v.model,
generation: v.generation || null,
year_from: v.year_from || null,
year_to: v.year_to || null
}

}

}

return null
}

function detectPart(query) {

for (const part in PARTS) {

if (query.includes(part)) return part

const aliases = PARTS[part].aliases || []

for (const a of aliases) {
if (query.includes(a)) return part
}

}

return null
}

function analyzeQuery(query) {

const text = normalize(query)

return {
vehicle: detectVehicle(text),
part: detectPart(text),
query
}

}

module.exports = {
analyzeQuery
}
