/* =====================================================
NDESTORE WHATSAPP AI SERVER
===================================================== */

require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const twilio = require("twilio")

const MessagingResponse = twilio.twiml.MessagingResponse

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
SESSION SETTINGS
===================================================== */

const SESSION_TIMEOUT = 60 * 60 * 1000

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp", async (req,res)=>{

const message = (req.body.Body || "").trim()
const phone = req.body.From || ""

const twiml = new MessagingResponse()

let session = sessionManager.getSession(phone)

if(!session){
session = sessionManager.createSession(phone)
}

if(!session.lastActivity){
session.lastActivity = Date.now()
}

/* =====================================================
SESSION TIMEOUT
===================================================== */

if(Date.now() - session.lastActivity > SESSION_TIMEOUT){

sessionManager.resetSession(phone)
session = sessionManager.createSession(phone)

}

session.lastActivity = Date.now()

const text = message.toLowerCase()

/* =====================================================
RETURN TO MENU
===================================================== */

if(message === "#"){

sessionManager.resetSession(phone)
session = sessionManager.createSession(phone)

session.state = "MENU"

twiml.message(mainMenu())
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
GREETING DETECTION
===================================================== */

if(
text === "hi" ||
text === "hello" ||
text === "assalamualaikum" ||
text === "salam"
){

session.state = "MENU"

twiml.message(mainMenu())
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
AUTO AI SEARCH
===================================================== */

try{

const autoSearch = detectAutoQuery(text)

if(autoSearch){

const result = await processAutoParts(text)

if(result){

twiml.message(result)
return res.type("text/xml").send(twiml.toString())

}

}

}catch(err){

console.log("AI search error:",err)

}

/* =====================================================
FIRST MESSAGE
===================================================== */

if(!session.state){

session.state = "MENU"

twiml.message(mainMenu())
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
MAIN MENU
===================================================== */

if(session.state === "MENU"){

if(message === "1"){

session.state = "AUTO_PARTS"

twiml.message(`Please share details in the following format

Part Name + Vehicle Make + Vehicle Model + Model Year

Example
Brake Pad Toyota Corolla 2018

# TO RETURN TO MAIN MENU`)

return res.type("text/xml").send(twiml.toString())

}

if(message === "2"){

session.state = "ACCESSORIES"

twiml.message(`Please share accessory details

Example
Toyota Revo Floor Mats

# TO RETURN TO MAIN MENU`)

return res.type("text/xml").send(twiml.toString())

}

if(message === "3"){

twiml.message(processDecals())
return res.type("text/xml").send(twiml.toString())

}

if(message === "4"){

session.state = "ORDER_STATUS"

twiml.message(`Please share your Order Number

Example
ND12345

# TO RETURN TO MAIN MENU`)

return res.type("text/xml").send(twiml.toString())

}

if(message === "5"){

session.state = "CHAT_SUPPORT"

twiml.message(`How can we assist you today?

# TO RETURN TO MAIN MENU`)

return res.type("text/xml").send(twiml.toString())

}

if(message === "6"){

session.state = "COMPLAINT"

twiml.message(`We regret the inconvenience caused.

Kindly share the following

Order Number
Details of the Issue

# TO RETURN TO MAIN MENU`)

return res.type("text/xml").send(twiml.toString())

}

twiml.message(mainMenu())
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
AUTO PARTS FLOW
===================================================== */

if(session.state === "AUTO_PARTS"){

const response = await processAutoParts(text)

if(!response){

twiml.message(`We could not understand your request.

Please use this format

Part Name + Vehicle Make + Model + Year

Example
Brake Pad Toyota Corolla 2018

# TO RETURN TO MAIN MENU`)

return res.type("text/xml").send(twiml.toString())

}

twiml.message(response)
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
ACCESSORIES FLOW
===================================================== */

if(session.state === "ACCESSORIES"){

const response = await processAccessories(text)

twiml.message(response)
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
DECALS
===================================================== */

if(session.state === "DECALS"){

twiml.message(processDecals())
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
ORDER STATUS
===================================================== */

if(session.state === "ORDER_STATUS"){

twiml.message(processOrderStatus(text))
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
CHAT SUPPORT
===================================================== */

if(session.state === "CHAT_SUPPORT"){

twiml.message(processChatSupport(text))
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
COMPLAINT
===================================================== */

if(session.state === "COMPLAINT"){

twiml.message(processComplaint(text))
return res.type("text/xml").send(twiml.toString())

}

/* =====================================================
FALLBACK
===================================================== */

twiml.message(escalate())
return res.type("text/xml").send(twiml.toString())

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
console.log("NDE AI Server running on port",PORT)
})
