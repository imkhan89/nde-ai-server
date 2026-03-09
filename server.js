/* =====================================================
NDESTORE WHATSAPP AI SERVER
===================================================== */

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

/* =====================================================
SESSION LOAD
===================================================== */

let session = sessionManager.getSession(phone)

if(!session){

session = sessionManager.createSession(phone)

}

/* =====================================================
SESSION TIMEOUT CHECK
===================================================== */

if(Date.now() - session.lastActivity > SESSION_TIMEOUT){

sessionManager.resetSession(phone)

session = sessionManager.createSession(phone)

}

session.lastActivity = Date.now()

/* =====================================================
RETURN TO MAIN MENU
===================================================== */

if(message === "#"){

sessionManager.resetSession(phone)

session = sessionManager.createSession(phone)

session.state = "MENU"

return res.send(mainMenu())

}

/* =====================================================
FIRST MESSAGE
===================================================== */

if(!session.state){

session.state = "MENU"

return res.send(mainMenu())

}

/* =====================================================
MAIN MENU
===================================================== */

if(session.state === "MENU"){

if(message === "1"){

session.state = "AUTO_PARTS"

return res.send(`Please share details in the following format

Part Name + Vehicle Make + Vehicle Model + Model Year

Example
Brake Pad Toyota Corolla 2018

# TO RETURN TO MAIN MENU`)

}

if(message === "2"){

session.state = "ACCESSORIES"

return res.send(`Please share accessory details

Example
Toyota Revo Floor Mats

# TO RETURN TO MAIN MENU`)

}

if(message === "3"){

return res.send(processDecals())

}

if(message === "4"){

session.state = "ORDER_STATUS"

return res.send(`Please share your Order Number

Example
ND12345

# TO RETURN TO MAIN MENU`)

}

if(message === "5"){

session.state = "CHAT_SUPPORT"

return res.send(`How can we assist you today?

# TO RETURN TO MAIN MENU`)

}

if(message === "6"){

session.state = "COMPLAINT"

return res.send(`We regret the inconvenience caused.

Kindly share the following

Order Number
Details of the Issue

# TO RETURN TO MAIN MENU`)

}

return res.send(mainMenu())

}

/* =====================================================
AUTO PARTS FLOW
===================================================== */

if(session.state === "AUTO_PARTS"){

const response = await processAutoParts(message)

return res.send(response)

}

/* =====================================================
ACCESSORIES FLOW
===================================================== */

if(session.state === "ACCESSORIES"){

const response = await processAccessories(message)

return res.send(response)

}

/* =====================================================
DECALS FLOW
===================================================== */

if(session.state === "DECALS"){

return res.send(processDecals())

}

/* =====================================================
ORDER STATUS FLOW
===================================================== */

if(session.state === "ORDER_STATUS"){

return res.send(processOrderStatus(message))

}

/* =====================================================
CHAT SUPPORT FLOW
===================================================== */

if(session.state === "CHAT_SUPPORT"){

return res.send(processChatSupport(message))

}

/* =====================================================
COMPLAINT FLOW
===================================================== */

if(session.state === "COMPLAINT"){

return res.send(processComplaint(message))

}

/* =====================================================
FALLBACK
===================================================== */

return res.send(escalate())

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
