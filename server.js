import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

import config from "./config.js"

import { initDB } from "./database/database.js"
import { saveConversation } from "./database/queries.js"

import { processMessage } from "./services/ai_engine.js"

import { whatsappRoute } from "./routes/whatsapp.js"

import { syncShopify } from "./sync/shopify_sync.js"

import { log } from "./utils/logger.js"

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

const db = await initDB()

log("Database initialized")

await syncShopify(db)

log("Shopify products synced")

async function messageHandler(phone,message){

log(`Incoming message from ${phone}: ${message}`)

await saveConversation(db,phone,message,"incoming")

const reply = await processMessage(db,phone,message)

await saveConversation(db,phone,reply,"outgoing")

return reply

}

whatsappRoute(app,messageHandler)

app.get("/",(req,res)=>{

res.send("NDE Automotive AI Server Running")

})

app.listen(config.SERVER_PORT,()=>{

log(`Server running on port ${config.SERVER_PORT}`)

})
