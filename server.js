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
SEND WHATSAPP MESSAGE
===================================================== */

function sendMessage(res,text){

const xml = `<Response>
<Message>${text}</Message>
</Response>`

res.set("Content-Type","text/xml")
res.send(xml)

}

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp", async (req,res)=>{

try{

const message = (req.body.Body || "").trim()
const phone = req.body.From || ""

let session = sessionManager.getSession(phone)

if(!session){
session = sessionManager.createSession(phone)
}

const text = message.toLowerCase()

/* =====================================================
RESET MENU
===================================================== */

if(message === "#"){

sessionManager.resetSession(phone)
session = sessionManager.createSession(phone)

return sendMessage(res, mainMenu())

}

/* =====================================================
GREETING
===================================================== */

if(text === "hi" || text === "hello" || text === "salam"){

return sendMessage(res, mainMenu())

}

/* =====================================================
AUTO SEARCH
===================================================== */

try{

if(detectAutoQuery(text)){

const result = await processAutoParts(text)

if(result){
return sendMessage(res,result)
}

}

}catch(err){

console.log("AI search error",err)

}

/* =====================================================
DEFAULT MENU
===================================================== */

if(!session.state){

session.state = "MENU"

return sendMessage(res, mainMenu())

}

/* =====================================================
MENU
===================================================== */

if(session.state === "MENU"){

if(message === "1"){

session.state = "AUTO_PARTS"

return sendMessage(res,
`Please share details in the following format

Part Name + Vehicle Make + Model + Year

Example
Brake Pad Toyota Corolla 2018

# TO RETURN TO MAIN MENU`
)

}

if(message === "2"){

session.state = "ACCESSORIES"

return sendMessage(res,
`Please share accessory details

Example
Toyota Revo Floor Mats

# TO RETURN TO MAIN MENU`
)

}

if(message === "3"){
return sendMessage(res,processDecals())
}

if(message === "4"){

session.state = "ORDER_STATUS"

return sendMessage(res,
`Please share your Order Number

Example
ND12345`
)

}

if(message === "5"){

session.state = "CHAT_SUPPORT"

return sendMessage(res,
`How can we assist you today?`
)

}

if(message === "6"){

session.state = "COMPLAINT"

return sendMessage(res,
`Please share Order Number and Issue`
)

}

return sendMessage(res, mainMenu())

}

/* =====================================================
AUTO PARTS
===================================================== */

if(session.state === "AUTO_PARTS"){

const response = await processAutoParts(text)

return sendMessage(res,response)

}

/* =====================================================
ACCESSORIES
===================================================== */

if(session.state === "ACCESSORIES"){

const response = await processAccessories(text)

return sendMessage(res,response)

}

/* =====================================================
ORDER STATUS
===================================================== */

if(session.state === "ORDER_STATUS"){

return sendMessage(res,processOrderStatus(text))

}

/* =====================================================
CHAT SUPPORT
===================================================== */

if(session.state === "CHAT_SUPPORT"){

return sendMessage(res,processChatSupport(text))

}

/* =====================================================
COMPLAINT
===================================================== */

if(session.state === "COMPLAINT"){

return sendMessage(res,processComplaint(text))

}

/* =====================================================
FALLBACK
===================================================== */

return sendMessage(res, escalate())

}catch(err){

console.log("Webhook error:",err)

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
