import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import twilio from "twilio"
import cron from "node-cron"

import { initDB } from "./database/database.js"
import { processMessage } from "./services/ai_engine.js"
import { syncShopify } from "./sync/shopify_sync.js"

const MessagingResponse = twilio.twiml.MessagingResponse

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let db

/*
START SERVER
*/
async function start(){

db = await initDB()

console.log("Database initialized")

try{

await syncShopify(db)

console.log("Initial Shopify sync complete")

}catch(err){

console.log("Shopify sync skipped:", err.message)

}

/*
AUTO SYNC EVERY 6 HOURS
*/
cron.schedule("0 */6 * * *", async ()=>{

console.log("Running scheduled Shopify sync")

try{

await syncShopify(db)

console.log("Scheduled Shopify sync completed")

}catch(err){

console.log("Scheduled Shopify sync failed:", err.message)

}

})

}

await start()

/*
WHATSAPP WEBHOOK
*/
app.post("/whatsapp", async (req,res)=>{

const twiml = new MessagingResponse()

try{

const phone = req.body?.From || ""
const message = req.body?.Body || ""

console.log("Incoming message:", phone, message)

let reply = "Message received."

if(phone && message){

reply = await processMessage(db, phone, message)

}

twiml.message(reply)

}catch(err){

console.error("WhatsApp error:", err)

twiml.message("System temporarily unavailable.")

}

res.set("Content-Type","text/xml")
res.status(200).send(twiml.toString())

})

/*
SHOPIFY PRODUCT WEBHOOK
*/
app.post("/shopify/webhook/product", async (req,res)=>{

try{

const product = req.body
const variant = product.variants?.[0]

if(!variant){

return res.sendStatus(200)

}

await db.run(
`INSERT OR REPLACE INTO products
(id,title,price,sku,handle)
VALUES (?,?,?,?,?)`,
[
product.id,
product.title,
variant.price,
variant.sku,
product.handle
]
)

console.log("Shopify product updated:", product.title)

res.sendStatus(200)

}catch(err){

console.error("Shopify webhook error:", err)

res.sendStatus(500)

}

})

/*
DEBUG — VERIFY PRODUCTS IN DATABASE
*/
app.get("/debug/products", async (req,res)=>{

try{

const row = await db.get("SELECT COUNT(*) as count FROM products")

res.json({
products: row.count
})

}catch(err){

res.json({
error: err.message
})

}

})

/*
HEALTH CHECK
*/
app.get("/", (req,res)=>{

res.send("NDE Automotive AI Server Running")

})

/*
RAILWAY PORT
*/
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{

console.log("Server running on port", PORT)

})
