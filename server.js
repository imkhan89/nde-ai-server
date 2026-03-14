import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

import config from "./config.js"

import { initDB } from "./database/database.js"
import { processMessage } from "./services/ai_engine.js"

import pkg from "twilio"
const { twiml } = pkg
const MessagingResponse = twiml.MessagingResponse

const app = express()

app.use(cors())

// REQUIRED FOR TWILIO
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let db

async function start(){

db = await initDB()

console.log("Database initialized")

}

await start()

app.post("/whatsapp", async (req,res)=>{

const twimlResponse = new MessagingResponse()

try{

console.log("Webhook received:", req.body)

const phone = req.body.From
const message = req.body.Body

console.log("Incoming:", phone, message)

const reply = await processMessage(db, phone, message)

twimlResponse.message(reply)

}catch(error){

console.error("Webhook error:", error)

twimlResponse.message("System temporarily unavailable.")

}

res.type("text/xml")
res.send(twimlResponse.toString())

})

app.get("/", (req,res)=>{
res.send("NDE Automotive AI Server Running")
})

app.listen(config.SERVER_PORT, ()=>{
console.log("Server running on port", config.SERVER_PORT)
})
