const MessagingResponse = require("twilio").twiml.MessagingResponse;


/*
MAIN MENU
Modern WhatsApp entry menu
*/

function sendMainMenu() {

const twiml = new MessagingResponse();

twiml.message(`
Welcome to *ndestore.com*

Pakistan's Automotive Parts Store

How can we help you today?

1️⃣ Auto Parts
2️⃣ Car Accessories
3️⃣ Decal Stickers
4️⃣ Order Status
5️⃣ Customer Support

Reply with a number to continue.
`);

return twiml.toString();

}



/*
VEHICLE CONFIRMATION CARD
*/

function sendVehicleConfirmation(vehicle){

const twiml = new MessagingResponse();

twiml.message(`
🚗 Vehicle detected

${vehicle.make} ${vehicle.model} ${vehicle.year}

Now send the required part.

Example:
Brake Pads
Oil Filter
Spark Plugs
`);

return twiml.toString();

}



/*
PRODUCT CARD ENGINE
Sends clear product image + link
*/

function sendProductCards(products){

const twiml = new MessagingResponse();

if(!products || products.length === 0){

twiml.message(`
No matching parts found.

Send request like:

Part + Make + Model + Year

Example
Brake Pads Corolla 2018
`);

return twiml.toString();

}


products.slice(0,3).forEach(product => {

twiml.message({

body:
`*${product.title}*

View Product
${product.url}

ndestore.com`,

mediaUrl: [product.image]

});

});


return twiml.toString();

}



/*
SERVICE KIT SUGGESTIONS
*/

function sendServiceKit(kit){

const twiml = new MessagingResponse();

if(!kit || kit.length === 0){

return null;

}

let message = `Recommended Service Parts\n\n`;

kit.forEach(item => {

message += `• ${item}\n`;

});

twiml.message(message);

return twiml.toString();

}



module.exports = {

sendMainMenu,
sendVehicleConfirmation,
sendProductCards,
sendServiceKit

};
