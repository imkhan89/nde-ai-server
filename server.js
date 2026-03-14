import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

import config from "./config.js"
import { initDB } from "./database/database.js"
import { processMessage } from "./services/ai_engine.js"

import twilio from "twilio"

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

app.post("/whatsapp", async (req, res) => {

const twiml = new MessagingResponse()

try {

const phone = req.body.From
const message = req.body.Body

console.log("Incoming:", phone, message)

const reply = await processMessage(db, phone, message)

twiml.message(reply)

} catch (error) {

console.error("Webhook error:", error)

twiml.message("System temporarily unavailable.")

}

res.writeHead(200, { "Content-Type": "text/xml" })
res.end(twiml.toString())

})

app.get("/", (req, res) => {

res.send("NDE Automotive AI Server Running")

})

app.listen(config.SERVER_PORT, () => {

console.log("Server running on port", config.SERVER_PORT)

})
