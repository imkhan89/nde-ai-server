const express = require("express")
const bodyParser = require("body-parser")

const conversationEngine = require("../conversation_engine")
const chatHandler = require("./chat_handler")

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

/* CLEAN PHONE NUMBER */

const phone = from.replace("whatsapp:","")

/* MENU SYSTEM */

try{

const menu = await conversationEngine(incoming,from)

if(menu && menu.reply){
reply = menu.reply
}

}catch(e){}

/* AI CHAT */

if(!reply){

const ai = await chatHandler.handleMessage(incoming,phone)

if(ai){
reply = ai
}

}

/* FALLBACK */

if(!reply){

reply = `
We are unable to understand your inquiry.

Please share:

Part Description
Vehicle Make
Vehicle Model
Model Year

Example:
Air Filter Suzuki Swift 2021

Reply # to return to the Main Menu.

For a Live Agent:
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
