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

// Twilio requires urlencoded parsing
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let db

async function start(){

db = await initDB()

console.log("Database initialized")

}

await start()

app.post("/whatsapp", async (req,res)=>{

console.log("Webhook received")

const twiml = new MessagingResponse()

try{

const phone = req.body.From
const message = req.body.Body

console.log("Incoming:", p
