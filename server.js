require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const sessionManager = require("./sessions/sessionManager")

const {
mainMenu,
processAutoParts,
processAccessories,
processDecals,
processOrderStatus,
processChatSupport,
processComplaint
} = require("./conversation_engine")

const { escalate } = require("./escalation_engine")

const detectAutoQuery = require("./ai/auto_query_detector")

const app = express()

app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000


/* =====================================================
SEND WHATSAPP RESPONSE
===================================================== */

function sendMessage(res,text){

const xml = `<Response>
<Message>${text}</Message>
</Response>`

res.set("Content-Type","text/xml")

return res.send(xml)

}


/* =====================================================
NORMALIZE INPUT
===================================================== */

function normalizeInput(text){

if(!text) return ""

return text
.replace(/\+/g," ")
.replace(/\s+/g," ")
.trim()

}


/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp", async (req,res)=>{

try{

console.log("Incoming Request:",req.body)

let message = (req.body.Body || "").trim()
const phone = req.body.From || ""

if(!message){
return sendMessage(res,mainMenu())
}

message = normalizeInput(message)

let session = sessionManager.getSession(phone)

if(!session){
session = sessionManager.createSession(phone)
}

const text = message.toLowerCase()

console.log("Message:",message)
console.log("Session:",session)


/* =====================================================
RESET SESSION
===================================================== */

if(message === "#"){

sessionManager.resetSession(phone)
session = sessionManager.createSession(phone)

session.state = "MENU"

return sendMessage(res,mainMenu())

}


/* =====================================================
GREETING
===================================================== */

if(
text === "hi" ||
text === "hello" ||
text === "salam" ||
text === "assalamualaikum"
){

session.state = "MENU"

return sendMessage(res,mainMenu())

}


/* =====================================================
AI AUTO PARTS DETECTION
===================================================== */

const aiQuery = detectAutoQuery(message)

if(aiQuery){

session.state = "AUTO_PARTS"

const response = await processAutoParts(message)

return sendMessage(res,response)

}


/* =====================================================
AUTO PARTS FLOW
===================================================== */

if(session.state === "AUTO_PARTS"){

const response = await processAutoParts(message)

return sendMessage(res,response)

}


/* =====================================================
ACCESSORIES FLOW
===================================================== */

if(session.state === "ACCESSORIES"){

const response = await processAccessories(message)

return sendMessage(res,response)

}


/* =====================================================
ORDER STATUS FLOW
===================================================== */

if(session.state === "ORDER_STATUS"){

return sendMessage(res,processOrderStatus(message))

}


/* =====================================================
CHAT SUPPORT FLOW
===================================================== */

if(session.state === "CHAT_SUPPORT"){

return sendMessage(res,processChatSupport(message))

}


/* =====================================================
COMPLAINT FLOW
===================================================== */

if(session.state === "COMPLAINT"){

return sendMessage(res,processComplaint(message))

}


/* =====================================================
DEFAULT SESSION STATE
===================================================== */

if(!session.state){
session.state = "MENU"
}


/* =====================================================
MAIN MENU
===================================================== */

if(session.state === "MENU"){

if(message === "1"){

session.state = "AUTO_PARTS"

return sendMessage(res,
`1 Auto Parts

Parts Inquiry, Please share the following details:

Part Description (e.g. Air Filter)
Vehicle Make (e.g. Suzuki)
Vehicle Model (e.g. Swift)
Model Year (e.g. 2021)

Or send in this format:

Part + Make + Model + Year

Example:
Air Filter Suzuki Swift 2021

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`)

}

if(message === "2"){

session.state = "ACCESSORIES"

return sendMessage(res,
`2 Car Accessories

Please share accessory details.

Example:
Floor Mat Suzuki Swift

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`)

}

if(message === "3"){

return sendMessage(res,
`3 Sticker Decals

Please select an option:

1 Sticker Collection
2 Sticker Themes
3 Customized Stickers

Reply with 1, 2 or 3 to continue.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`)

}

if(message === "4"){

session.state = "ORDER_STATUS"

return sendMessage(res,
`4 Order Status

Kindly share your Order ID.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`)

}

if(message === "5"){

session.state = "CHAT_SUPPORT"

return sendMessage(res,
`5 Chat Support

You are now connected with AI Support.

Please describe your inquiry.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`)

}

if(message === "6"){

session.state = "COMPLAINT"

return sendMessage(res,
`6 Complaints

Kindly share the following:

Order ID
Describe the Issue

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`)

}

return sendMessage(res,mainMenu())

}


/* =====================================================
FINAL FALLBACK
===================================================== */

return sendMessage(res,mainMenu())

}catch(err){

console.log("Webhook Error:",err)

return sendMessage(res,"System temporarily unavailable")

}

})


/* =====================================================
HEALTH CHECK
===================================================== */

app.get("/",(req,res)=>{

res.send("NDE AI Server Running")

})


/* =====================================================
START SERVER
===================================================== */

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
