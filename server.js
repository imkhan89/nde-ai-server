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

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let db

async function start() {

db = await initDB()

console.log("Database initialized")

}

await start()

app.post("/whatsapp", async (req,res)=>{

try {

const phone = req.body?.From
const message = req.body?.Body

console.log("Incoming:", phone, message)

const response = new MessagingResponse()

response.message("Processing your request...")

res.type("text/xml")
res.send(response.toString())

// Process AI after response
if(phone && message){

processMessage(db, phone, message)
.then(reply => {
console.log("AI reply:", reply)
})
.catch(err => {
console.error("AI error:", err)
})

}

} catch (error) {

console.error("Webhook crash:", error)

const response = new MessagingResponse()

response.message("System error")

res.type("text/xml")
res.send(response.toString())

}

})

app.get("/", (req,res)=>{
res.send("AI Server Running")
})

app.listen(config.SERVER_PORT, ()=>{
console.log("Server running on port", config.SERVER_PORT)
})
