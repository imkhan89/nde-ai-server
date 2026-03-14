const express = require("express")
const bodyParser = require("body-parser")

const chatHandler = require("./chat_handler")
const catalogSync = require("./shopify_catalog_sync_engine")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

const PORT = process.env.PORT || 8080

/* HEALTH CHECK */

app.get("/",(req,res)=>{

res.send("NDE AI Server Running")

})

/* CATALOG STATUS */

app.get("/catalog-status",(req,res)=>{

try{

const fs = require("fs")
const path = require("path")

const file =
path.join(__dirname,"../data/shopify_products.json")

if(!fs.existsSync(file)){

return res.json({
status:"loading",
products:0
})

}

const raw = fs.readFileSync(file,"utf8")

const products = JSON.parse(raw)

return res.json({
status:"ok",
cached_products:products.length
})

}catch(err){

return res.json({
status:"error"
})

}

})

/* WHATSAPP WEBHOOK */

app.post("/webhook",async (req,res)=>{

try{

const message =
req.body.Body ||
req.body.message ||
""

const phone =
req.body.From ||
req.body.phone ||
""

const reply =
await chatHandler.handleMessage(message,phone)

res.send(reply)

}catch(err){

console.log("Webhook error:",err.message)

res.send("System error.")

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
