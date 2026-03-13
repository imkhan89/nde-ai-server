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

const phone = from.replace("whatsapp:","")

let reply = ""

/* MENU SYSTEM */

try{

const menu = await conversationEngine(incoming,from)

if(menu && menu.reply){
reply = menu.reply
}

}catch(e){
console.log("Menu engine error:",e.message)
}

/* AI SYSTEM */

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

For live support contact:

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

router.get("/",(req,res)=>{
res.send("Webhook Active")
})

module.exports = router
