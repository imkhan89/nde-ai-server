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

async function start(){

console.log("Initializing database...")

db = await initDB()

console.log("Database initialized")

console.log("Starting Shopify sync...")

try{

await syncShopify(db)

console.log("Initial Shopify sync finished")

}catch(err){

console.log("Shopify sync error:", err.message)

}

console.log("Scheduling Shopify auto sync...")

cron.schedule("0 */6 * * *", async ()=>{

console.log("Running scheduled Shopify sync")

try{

await syncShopify(db)

console.log("Scheduled sync completed")

}catch(err){

console.log("Scheduled sync error:", err.message)

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

console.log("WhatsApp error:", err.message)

twiml.message("System temporarily unavailable.")

}

res.set("Content-Type","text/xml")
res.status(200).send(twiml.toString())

})

/*
DEBUG PRODUCT COUNT
*/
app.get("/debug/products", async (req,res)=>{

try{

const row = await db.get("SELECT COUNT(*) as count FROM products")

res.json(row)

}catch(err){

res.json({error: err.message})

}

})

app.get("/", (req,res)=>{

res.send("NDE Automotive AI Server Running")

})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{

console.log("Server running on port", PORT)

})
