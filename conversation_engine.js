/* =====================================================
NDESTORE WHATSAPP AI CONVERSATION ENGINE
===================================================== */

const { analyzeAutomotiveQuery } = require("./automotive_ai_engine")

const { generateSearch } = require("./shopify_search_engine")

const {
searchProducts,
findBestMatch,
buildProductURL
} = require("./product_search_engine")

const { generateTicket } = require("./complaint_ticket_engine")
const { handleKnowledge } = require("./knowledge_engine")

/* =====================================================
MAIN MENU
===================================================== */

function mainMenu(){

return `Welcome to NDESTORE.COM

Select one option to proceed

1 Auto Parts
2 Accessories
3 Decal Stickers
4 Order Status
5 Chat Support
6 Complaints

Reply with the number to continue`

}

/* =====================================================
AUTO PARTS SEARCH
===================================================== */

async function processAutoParts(message){

const analysis = analyzeAutomotiveQuery(message)

const searchURL = generateSearch(analysis)

const bestProduct = findBestMatch(analysis.query)

let response = `Vehicle Detection

Make: ${analysis.make || "Unknown"}
Model: ${analysis.model || "Unknown"}
Generation: ${analysis.generation || "Unknown"}
Part: ${analysis.part || "Unknown"}

`

if(bestProduct){

response += `Recommended Product

${bestProduct.title}
${buildProductURL(bestProduct.handle)}

`

}

response += `Search Results
${searchURL}

# TO RETURN TO MAIN MENU`

return response

}

/* =====================================================
ACCESSORIES
===================================================== */

async function processAccessories(message){

const url = generateSearch({query:message})

return `Accessory Search Results

${url}

# TO RETURN TO MAIN MENU`

}

/* =====================================================
DECALS
===================================================== */

function processDecals(){

return `Browse Decal Stickers

https://www.ndestore.com/collections/stickers-decal

For Custom Sticker

Send
Image
Required Dimensions

Example
10 inch x 4 inch

# TO RETURN TO MAIN MENU`

}

/* =====================================================
ORDER STATUS
===================================================== */

function processOrderStatus(orderNumber){

return `Order Status

Order Number
${orderNumber}

Track or check details at

https://www.ndestore.com

# TO RETURN TO MAIN MENU`

}

/* =====================================================
CHAT SUPPORT
===================================================== */

function processChatSupport(message){

const knowledge = handleKnowledge(message)

if(knowledge){

return `${knowledge}

# TO RETURN TO MAIN MENU`

}

return `Our representative will assist you shortly

WhatsApp
+92 323 4954117

# TO RETURN TO MAIN MENU`

}

/* =====================================================
COMPLAINT
===================================================== */

function processComplaint(message){

const lines = message.split("\n")

const orderNumber = lines[0] || "UNKNOWN"

const ticket = generateTicket(orderNumber)

return `Complaint Registered

Ticket Number
${ticket}

We regret the inconvenience caused.

Our representative will contact you shortly.

WhatsApp
+92 323 4954117

# TO RETURN TO MAIN MENU`

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {

mainMenu,
processAutoParts,
processAccessories,
processDecals,
processOrderStatus,
processChatSupport,
processComplaint

}
