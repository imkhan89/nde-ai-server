/* =====================================================
NDESTORE WHATSAPP AI CONVERSATION ENGINE
===================================================== */

const { analyzeAutomotiveQuery } = require("./automotive_ai_engine")
const { searchProducts } = require("./product_search_engine")
const { buildShopifySearch } = require("./shopify_search_engine")

const { recommendProducts } = require("./sales_recommendation_engine")
const { generateTicket } = require("./complaint_ticket_engine")
const { handleKnowledge } = require("./knowledge_engine")

const {
detectInternationalCustomer,
verifyLocation
} = require("./international_customer_engine")

const { convertPKRtoUSD } = require("./currency_conversion_engine")

const { createStickerOrder } = require("./sticker_custom_order_engine")

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

Reply with number

# TO RETURN TO MAIN MENU`

}

/* =====================================================
AUTO PARTS SEARCH
===================================================== */

async function processAutoParts(message, phone){

const analysis = analyzeAutomotiveQuery(message)

const query = analysis.query

const results = searchProducts(query)

const searchURL = buildShopifySearch(query)

const recommendations = recommendProducts(query)

/* =====================================================
INTERNATIONAL CUSTOMER DETECTION
===================================================== */

const international = detectInternationalCustomer(phone)

let response = `Vehicle Detection

Make: ${analysis.make}
Model: ${analysis.model}
Generation: ${analysis.generation}
Part: ${analysis.part}

Products Found
${searchURL}
`

/* =====================================================
RECOMMENDATIONS
===================================================== */

if(recommendations && recommendations.length){

response += `

Recommended Products
`

for(const r of recommendations){

response += `
${r.title}
https://www.ndestore.com/products/${r.handle || ""}
`

}

}

/* =====================================================
USD PRICING FOR INTERNATIONAL USERS
===================================================== */

if(international && recommendations.length){

response += `

Estimated USD Prices
`

for(const r of recommendations){

const usd = await convertPKRtoUSD(parseFloat(r.price || 0))

if(usd){

response += `
${r.title} - $${usd}
`

}

}

}

response += `

# TO RETURN TO MAIN MENU`

return response

}

/* =====================================================
ACCESSORIES SEARCH
===================================================== */

async function processAccessories(message){

const query = message

const url = buildShopifySearch(query)

return `Accessory Search Results

${url}

# TO RETURN TO MAIN MENU`

}

/* =====================================================
DECAL FLOW
===================================================== */

function processDecals(){

return `Browse Decal Stickers

https://www.ndestore.com/collections/stickers-decal

For Custom Sticker

Send:
Image
Required Dimensions

Example
10 inch x 4 inch

# TO RETURN TO MAIN MENU`

}

/* =====================================================
CUSTOM STICKER ORDER
===================================================== */

function processCustomSticker(data){

const order = createStickerOrder(data)

return `Custom Sticker Request Received

Size: ${order.size}

Our representative will contact you shortly.

WhatsApp
+92 323 4954117

# TO RETURN TO MAIN MENU`

}

/* =====================================================
ORDER STATUS
===================================================== */

function processOrderStatus(orderNumber){

return `Checking Order Status

Order: ${orderNumber}

Visit
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
COMPLAINT SYSTEM
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
processCustomSticker,
processOrderStatus,
processChatSupport,
processComplaint

}
