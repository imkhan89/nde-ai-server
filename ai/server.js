const express = require("express")
const bodyParser = require("body-parser")
const MessagingResponse = require("twilio").twiml.MessagingResponse

const chatHandler = require("./chat_handler")
const catalogSync = require("./shopify_catalog_sync_engine")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8080


/* HEALTH CHECK */

app.get("/", (req,res)=>{
res.send("NDE AI Server Running")
})


/* CATALOG STATUS */

app.get("/catalog-status",(req,res)=>{

try{

const fs = require("fs")
const path = require("path")

const file = path.join(__dirname,"../data/shopify_products.json")

if(!fs.existsSync(file)){
return res.json({status:"loading",cached_products:0})
}

const raw = fs.readFileSync(file,"utf8")
const products = JSON.parse(raw)

res.json({
status:"ok",
cached_products:products.length
})

}catch(err){

res.json({status:"error"})

}

})


/* WHATSAPP WEBHOOK */

app.post("/webhook", async (req,res)=>{

try{

const incomingMessage = req.body.Body || ""
const phone = req.body.From || ""

const reply = await chatHandler.handleMessage(incomingMessage,phone)

const twiml = new MessagingResponse()

twiml.message(reply)

res.type("text/xml")
res.send(twiml.toString())

}catch(err){

console.log("Webhook error:",err.message)

const twiml = new MessagingResponse()
twiml.message("System error. Please contact support.")

res.type("text/xml")
res.send(twiml.toString())

}

})


/* START SERVER */

app.listen(PORT,()=>{

console.log("NDE AI Server Running on port:",PORT)

startSystem()

})


/* START SYSTEM */

async function startSystem(){

try{

console.log("Starting Shopify full catalog sync...")

await catalogSync.fetchAllProducts()

console.log("Catalog sync finished")

}catch(err){

console.log("Startup error:",err.message)

}

}
