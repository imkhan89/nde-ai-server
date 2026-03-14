import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import twilio from "twilio"

import config from "./config.js"
import { initDB } from "./database/database.js"
import { processMessage } from "./services/ai_engine.js"

const MessagingResponse = twilio.twiml.MessagingResponse

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let db

async function start() {

db = await initDB()

console.log("Database initialized")

}

await start()

app.post("/whatsapp", async (req,res)=>{

const twiml = new MessagingResponse()

try{

// Safety parsing
const phone = req.body?.From || ""
const message = req.body?.Body || ""

console.log("Webhook payload:", req.body)
console.log("Incoming:", phone, message)

let reply = "Message received."

if(phone && message){

reply = await processMessage(db, phone, message)

}

twiml.message(reply)

}catch(err){

console.error("Webhook error:", err)

twiml.message("System error. Please try again.")

}

res.set("Content-Type","text/xml")
res.status(200).send(twiml.toString())

})

app.get("/", (req,res)=>{
res.send("NDE Automotive AI Server Running")
})

app.listen(config.SERVER_PORT, ()=>{
console.log("Server running on port", config.SERVER_PORT)
})
