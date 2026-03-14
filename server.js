import express from "express"
import cors from "cors"

import config from "./config.js"

import { initDB } from "./database/database.js"
import { processMessage } from "./services/ai_engine.js"

import pkg from "twilio"
const { twiml } = pkg
const MessagingResponse = twiml.MessagingResponse

const app = express()

app.use(cors())

// REQUIRED FOR TWILIO
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let db

try {

db = await initDB()
console.log("Database initialized")

} catch (e) {

console.error("Database failed", e)

}

app.post("/whatsapp", async (req,res)=>{

const response = new MessagingResponse()

try {

console.log("Webhook body:", req.body)

const phone = req.body?.From || "unknown"
const message = req.body?.Body || ""

console.log("Incoming:", phone, message)

let reply = "Message received."

if(db && message){

reply = await processMessage(db, phone, message)

}

response.message(reply)

} catch (error) {

console.error("Webhook crash:", error)

response.message("System error. Please try again.")

}

res.type("text/xml")
res.send(response.toString())

})

app.get("/", (req,res)=>{
res.send("AI Server Running")
})

app.listen(config.SERVER_PORT, ()=>{
console.log("Server running on port", config.SERVER_PORT)
})
