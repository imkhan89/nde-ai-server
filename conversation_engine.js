/* =====================================================
NDESTORE WHATSAPP AI CONVERSATION ENGINE
Handles customer interaction flow
===================================================== */

const { analyzeAutomotiveQuery } = require("./automotive_ai_engine")
const { generateSearch } = require("./shopify_search_engine")

const {
findBestMatch,
buildProductURL
} = require("./product_search_engine")

const { checkFitment } = require("./fitment_engine")
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
AUTO PARTS PROCESSING
===================================================== */

async function processAutoParts(message){

if(!message){

return `Please share details in the following format

Part Name + Vehicle Make + Vehicle Model + Model Year

Example
Brake Pad Toyota Corolla 2018

# TO RETURN TO MAIN MENU`

}

let analysis = {}

try{

analysis = analyzeAutomotiveQuery(message)

}catch(err){

console.log("AI analysis error:",err)
analysis = {}

}


/* =====================================================
SAFE QUERY BUILD
===================================================== */

const query = analysis.query || message

let searchURL = ""

try{

searchURL = generateSearch({query})

}catch(err){

searchURL = `https://www.ndestore.com/search?q=${encodeURIComponent(query)}`

}


/* =====================================================
PRODUCT SEARCH
===================================================== */

let bestProduct = null
let fitment = null

try{

bestProduct = findBestMatch(query)

}catch(err){
console.log("Product search error:",err)
}

try{

fitment = checkFitment(analysis)

}catch(err){
console.log("Fitment check error:",err)
}


/* =====================================================
RESPONSE BUILD
===================================================== */

let response = `Vehicle Detection

Make: ${analysis.make || "Unknown"}
Model: ${analysis.model || "Unknown"}
Generation: ${analysis.generation || "Unknown"}
Part: ${analysis.part || "Unknown"}

`


/* =====================================================
FITMENT MATCH
===================================================== */

if(fitment){

response += `Compatible Product

${fitment.title}
https://www.ndestore.com/products/${fitment.handle}

`

}


/* =====================================================
LOCAL PRODUCT MATCH
===================================================== */

else if(bestProduct){

response += `Recommended Product

${bestProduct.title}
${buildProductURL(bestProduct.handle)}

`

}


/* =====================================================
SEARCH FALLBACK
===================================================== */

response += `Search Results
${searchURL}

# TO RETURN TO MAIN MENU`

return response

}


/* =====================================================
ACCESSORIES SEARCH
===================================================== */

async function processAccessories(message){

if(!message){

return `Please share accessory details

Example
Toyota Revo Floor Mats

# TO RETURN TO MAIN MENU`

}

let url = ""

try{

url = generateSearch({query:message})

}catch(err){

url = `https://www.ndestore.com/search?q=${encodeURIComponent(message)}`

}

return `Accessory Search Results

${url}

# TO RETURN TO MAIN MENU`

}


/* =====================================================
DECAL STICKERS
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

if(!orderNumber){

return `Please share your order number

Example
ND12345

# TO RETURN TO MAIN MENU`

}

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

let knowledge = null

try{

knowledge = handleKnowledge(message)

}catch(err){}

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
COMPLAINT SYSTEM
===================================================== */

function processComplaint(message){

if(!message){

return `Please share the following

Order Number
Details of the Issue

Example
ND12345
Product damaged

# TO RETURN TO MAIN MENU`

}

const lines = message.split("\n")

const orderNumber = lines[0] || "UNKNOWN"

let ticket = "N/A"

try{

ticket = generateTicket(orderNumber)

}catch(err){}

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
