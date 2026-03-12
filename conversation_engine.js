const automotiveAI = require("./automotive_ai_engine");

function buildVehicleText(vehicle){

if(!vehicle) return null;

let text = "";

if(vehicle.brand) text += vehicle.brand + " ";
if(vehicle.model) text += vehicle.model + " ";
if(vehicle.variant) text += vehicle.variant + " ";

if(vehicle.years){

if(Array.isArray(vehicle.years)){
text += "(" + vehicle.years.join(", ") + ")";
}else{
text += "(" + vehicle.years + ")";
}

}

return text.trim();

}


function conversationEngine(message){

if(!message || typeof message !== "string"){

return {
reply:"Please send vehicle and required part.\n\nExample:\nCivic 2018 brake pads"
}

}

let ai = null;

try{

ai = automotiveAI(message);

}catch(error){

console.error("AI engine error:",error);

return {
reply:"System processing error. Please try again."
}

}

if(!ai){

return {
reply:"Please provide vehicle and required part."
}

}

const vehicle = ai.vehicle || null;
const part = ai.part || null;
const year = ai.year || null;

const vehicleText = buildVehicleText(vehicle);


/* =========================
NO DATA DETECTED
========================= */

if(!vehicle && !part){

return {

reply:
"Please provide vehicle and required part.\n\nExample:\nCivic 2018 brake pads"

}

}


/* =========================
ONLY VEHICLE DETECTED
========================= */

if(vehicle && !part){

return {

vehicle,

reply:
"Vehicle detected:\n"+
vehicleText+
"\n\nPlease tell the required part."

}

}


/* =========================
ONLY PART DETECTED
========================= */

if(!vehicle && part){

return {

part,

reply:
"Part detected: "+
(part.name || part.part || "Part")+
"\n\nPlease provide vehicle details."

}

}


/* =========================
VEHICLE + PART DETECTED
========================= */

if(vehicle && part){

return {

vehicle,
part,
year,

reply:
"Vehicle: "+
vehicleText+
"\nPart: "+
(part.name || part.part || "Part")+
"\n\nSearching availability..."

}

}


/* =========================
FINAL FALLBACK
========================= */

return {

reply:"Please provide vehicle and required part."

}

}


/* =========================
EXPORT
========================= */

module.exports = conversationEngine;
