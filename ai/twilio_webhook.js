const express = require("express")
const bodyParser = require("body-parser")

const chatHandler = require("./chat_handler")
const conversationEngine = require("../conversation_engine")

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post("/whatsapp", async (req,res)=>{

let incoming = ""
let from = ""

try{

incoming = req.body.Body || ""
from = req.body.From || ""

}catch(e){}

let reply = ""

/* CLEAN PHONE */

const phone = from.replace("whatsapp:","")

/* MENU ENGINE */

try{

const menu = await conversationEngine(incoming,from)

if(menu && menu.reply){
reply = menu.reply
}

}catch(e){}

/* AI ENGINE */

if(!reply){

try{

reply = await chatHandler.handleMessage(incoming,phone)

}catch(err){

console.log("AI error:",err.message)

}

}

/* FALLBACK */

if(!reply){

reply = `
Welcome to ndeStore Auto Parts AI

Send request in this format:

Part + Make + Model + Year

Example:
Brake Pads Toyota Corolla 2016

Need assistance?

Live Agent:
WhatsApp +92 308 7643288
`

}

res.set("Content-Type","text/xml")

res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`)

})

module.exports = router
