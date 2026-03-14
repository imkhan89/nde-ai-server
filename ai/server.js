const express = require("express")
const bodyParser = require("body-parser")
const { MessagingResponse } = require("twilio").twiml

const chatHandler = require("./chat_handler")
const catalogSync = require("./shopify_catalog_sync_engine")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 8080


app.get("/", (req,res)=>{
res.send("NDE AI Server Running")
})


app.get("/catalog-status",(req,res)=>{

const fs=require("fs")
const path=require("path")

const file=path.join(__dirname,"../data/shopify_products.json")

if(!fs.existsSync(file)){
return res.json({status:"loading",cached_products:0})
}

const raw=fs.readFileSync(file,"utf8")
const products=JSON.parse(raw)

res.json({
status:"ok",
cached_products:products.length
})

})


async function handleWebhook(req,res){

const twiml=new MessagingResponse()

try{

const incomingMessage=req.body.Body||""
const phone=req.body.From||""

console.log("Incoming message:",incomingMessage)

const reply=await chatHandler.handleMessage(incomingMessage,phone)

twiml.message(reply)

}catch(err){

console.log("Webhook error:",err.message)

twiml.message("System error. Please try again.")

}

res.writeHead(200,{"Content-Type":"text/xml"})
res.end(twiml.toString())

}


app.post("/webhook",handleWebhook)
app.post("/whatsapp",handleWebhook)


app.listen(PORT,()=>{

console.log("NDE AI Server Running on port:",PORT)

startSystem()

})


async function startSystem(){

try{

console.log("Starting Shopify full catalog sync...")

await catalogSync.fetchAllProducts()

console.log("Catalog sync finished")

}catch(err){

console.log("Startup error:",err.message)

}

}
