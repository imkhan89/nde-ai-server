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
TEXT FORMATTER
===================================================== */

function capitalize(text){

if(!text) return ""

return text
.toString()
.split(" ")
.map(word => word.charAt(0).toUpperCase() + word.slice(1))
.join(" ")

}


/* =====================================================
COMMON FOOTER
===================================================== */

function footer(){

return `Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`

}


/* =====================================================
MAIN MENU
===================================================== */

function mainMenu(){

return `Welcome to ndestore.com AI Support

Please choose an option:

1 Auto Parts
2 Car Accessories
3 Sticker Decals
4 Order Status
5 Chat Support
6 Complaints

Reply with 1, 2, 3, 4, 5 or 6 to continue.

${footer()}`

}


/* =====================================================
AUTO PARTS PROCESSING
===================================================== */

async function processAutoParts(message){

if(!message){

return `Parts Inquiry

Please share the following details:

Part Description (e.g. Air Filter)
Vehicle Make (e.g. Suzuki)
Vehicle Model (e.g. Swift)
Model Year (e.g. 2021)

Or send in this format:

Part + Make + Model + Year

Example:
Air Filter Suzuki Swift 2021

${footer()}`

}


/* =====================================================
AI ANALYSIS
===================================================== */

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

let response = `Vehicle Details

Part Description: ${capitalize(analysis.part) || "Unknown"}
Vehicle Make: ${capitalize(analysis.make) || "Unknown"}
Vehicle Model: ${capitalize(analysis.model) || "Unknown"}
Model Year: ${analysis.year || "Unknown"}

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

response += `Kindly visit the following URL:

${searchURL}

${footer()}`

return response

}


/* =====================================================
ACCESSORIES SEARCH
===================================================== */

async function processAccessories(message){

if(!message){

return `Car Accessories

Please share accessory details.

Example:
Floor Mat Suzuki Swift

${footer()}`

}

let url = ""

try{

url = generateSearch({query:message})

}catch(err){

url = `https://www.ndestore.com/search?q=${encodeURIComponent(message)}`

}

return `Accessory Search Results

${url}

${footer()}`

}


/* =====================================================
DECAL STICKERS
===================================================== */

function processDecals(){

return `Sticker Decals

Please select an option:

1 Sticker Collection
2 Sticker Themes
3 Customized Stickers

${footer()}`

}


/* =====================================================
ORDER STATUS
===================================================== */

function processOrderStatus(orderNumber){

if(!orderNumber){

return `Order Status

Please share your Order ID.

Example:
ND12345

${footer()}`

}

return `Order Details

Order ID: ${orderNumber}

Please check the following link:

https://www.ndestore.com

${footer()}`

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

${footer()}`

}

return `Our representative will assist you shortly.

For immediate support please contact:

WhatsApp +92 308 7643288

${footer()}`

}


/* =====================================================
COMPLAINT SYSTEM
===================================================== */

function processComplaint(message){

if(!message){

return `Complaint Registration

Please share the following:

Order ID
Describe the Issue

Example:
ND12345
Product damaged

${footer()}`

}

const lines = message.split("\n")

const orderNumber = lines[0] || "UNKNOWN"

let ticket = "N/A"

try{

ticket = generateTicket(orderNumber)

}catch(err){}

return `Complaint Submitted

Ticket Number: ${ticket}

Our support team will review your complaint and respond.

${footer()}`

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
