import express from "express"
import { processUserMessage } from "../services/ai_engine.js"
import twilio from "twilio"

const router = express.Router()

async function handleWhatsapp(req, res) {

  try {

    const message = req.body.Body || ""

    const reply = await processUserMessage(message)

    const twiml = new twilio.twiml.MessagingResponse()

    twiml.message(reply)

    res.type("text/xml")
    res.send(twiml.toString())

  } catch (err) {

    console.error(err)

    const twiml = new twilio.twiml.MessagingResponse()

    twiml.message("Server error. Please try again.")

    res.type("text/xml")
    res.send(twiml.toString())

  }

}

router.post("/whatsapp", handleWhatsapp)

/* support second endpoint Twilio might call */
router.post("/", handleWhatsapp)

export default router
