const MessagingResponse = require("twilio").twiml.MessagingResponse;


/*
SHOW VEHICLE MAKES
*/

function sendVehicleMakes(vehicleDB){

const twiml = new MessagingResponse();

let message = "Select your vehicle make\n\n";

const makes = [...new Set(vehicleDB.map(v => v.make))];

makes.slice(0,10).forEach((make,i)=>{

message += `${i+1} ${make}\n`;

});

twiml.message(message);

return twiml.toString();

}



/*
SHOW VEHICLE MODELS
*/

function sendVehicleModels(vehicleDB, make){

const twiml = new MessagingResponse();

let message = `Select ${make} model\n\n`;

const models = vehicleDB
.filter(v => v.make.toLowerCase() === make.toLowerCase())
.map(v => v.model);

const uniqueModels = [...new Set(models)];

uniqueModels.slice(0,10).forEach((model,i)=>{

message += `${i+1} ${model}\n`;

});

twiml.message(message);

return twiml.toString();

}



/*
SHOW VEHICLE YEARS
*/

function sendVehicleYears(vehicleDB, make, model){

const twiml = new MessagingResponse();

let message = `Select ${make} ${model} year\n\n`;

const vehicles = vehicleDB.filter(v =>
v.make.toLowerCase() === make.toLowerCase()
&&
v.model.toLowerCase() === model.toLowerCase()
);

let years = [];

vehicles.forEach(v=>{

for(let y=v.startYear; y<=v.endYear; y++){

years.push(y);

}

});

years = [...new Set(years)].sort((a,b)=>b-a);

years.slice(0,10).forEach((year,i)=>{

message += `${i+1} ${year}\n`;

});

twiml.message(message);

return twiml.toString();

}



module.exports = {

sendVehicleMakes,
sendVehicleModels,
sendVehicleYears

};
