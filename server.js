import express from "express"
import cors from "cors"

import config from "./config.js"

import { initDB } from "./database/database.js"
import { saveConversation } from "./database/queries.js"
import { processMessage } from "./services/ai_engine.js"
import { syncShopify } from "./sync/shopify_sync.js"
import { log } from "./utils/logger.js"

import pkg from "twilio"
const { twiml } = pkg
const MessagingResponse = twiml.MessagingResponse

const app = express()

app.use(cors())

// REQUIRED FOR TWILIO WEBHOOK
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const db = await initDB()

log("Database initialized")

await syncShopify(db)

log("Shopify products synced")

app.post("/whatsapp", async (req,res)=>{

try{

const phone = req.body.From
const message = req.body.Body

log(`Incoming message: ${phone} ${message}`)

await saveConversation(db, phone, message, "incoming")

const reply = await processMessage(db, phone, message)

await saveConversation(db, phone, reply, "outgoing")

const response = new MessagingResponse()

response.message(reply)

res.type("text/xml")

res.send(response.toString())

}catch(error){

console.error("Webhook error:", error)

const response = new MessagingResponse()

response.message("System error. Please try again.")

res.type("text/xml")

res.send(response.toString())

}

})

app.get("/", (req,res)=>{
res.send("NDE Automotive AI Server Running")
})

app.listen(config.SERVER_PORT, ()=>{
log(`Server running on port ${config.SERVER_PORT}`)
})
