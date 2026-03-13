const mechanicEngine =
require("./mechanic_diagnostic_engine")

const maintenanceEngine =
require("./predictive_maintenance_engine")

const compatibilityEngine =
require("./compatibility_prediction_engine")

const salesEngine =
require("./sales_conversion_ai_engine")

const vehicleMemory =
require("./vehicle_memory_engine")

function normalize(text){

if(!text) return ""

return text.toLowerCase().trim()

}

function detectMileage(message){

const m = message.match(/([0-9]{3,6})\s?(km|kms|kilometer|kilometers)/i)

if(!m) return null

return parseInt(m[1])

}

function buildVehicleContext(phone,message){

let vehicle = vehicleMemory.getCustomerVehicle(phone)

if(!vehicle) return null

return vehicle

}

function buildAIResponse(phone,message){

let response = ""

const vehicle = buildVehicleContext(phone,message)

const mileage = detectMileage(message)

const diagnostic =
mechanicEngine.buildDiagnosticResponse(message)

if(diagnostic){

response += diagnostic + "\n"

}

if(vehicle && mileage){

const maintenance =
maintenanceEngine.buildMaintenanceMessage(vehicle,mileage)

if(maintenance){

response += maintenance + "\n"

}

}

const sales =
salesEngine.generateSalesResponse(message)

if(sales){

response += sales + "\n"

}

return response || null

}

module.exports = {

buildAIResponse

}
