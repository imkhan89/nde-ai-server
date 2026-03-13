const MessagingResponse = require("twilio").twiml.MessagingResponse;



function sendMainMenu() {

const twiml = new MessagingResponse();

twiml.message(`
Welcome to *ndestore.com*

Pakistan's Automotive Parts Store

Choose a category:

1️⃣ Auto Parts
2️⃣ Car Accessories
3️⃣ Decal Stickers
4️⃣ Order Status
5️⃣ Customer Support

Send the number to continue.
`);

return twiml.toString();

}



function sendVehicleConfirmation(vehicle){

const twiml = new MessagingResponse();

twiml.message(`
Vehicle detected

🚗 ${vehicle.make} ${vehicle.model} ${vehicle.year}

Send your required part.

Example:
Brake Pads
Oil Filter
Spark Plugs
`);

return twiml.toString();

}



function sendProductCards(products){

const twiml = new MessagingResponse();

if(!products || products.length === 0){

twiml.message(`
No matching parts found.

Send request in format:

Part + Make + Model + Year

Example
Brake Pads Corolla 2018
`);

return twiml.toString();

}



products.slice(0,3).forEach(p => {

twiml.message({

mediaUrl: [p.image],

body:
`*${p.title}*

View Product
${p.url}

ndestore.com`

});

});

return twiml.toString();

}



function sendServiceKit(kit){

const twiml = new MessagingResponse();

if(!kit || kit.length === 0) return null;

let text = `Recommended Service Parts\n\n`;

kit.forEach(k => {

text += `• ${k}\n`;

});

twiml.message(text);

return twiml.toString();

}



module.exports = {

sendMainMenu,
sendVehicleConfirmation,
sendProductCards,
sendServiceKit

};
