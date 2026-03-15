import express from "express"
import twilio from "twilio"

const router = express.Router()

router.post("/whatsapp", async (req, res) => {

    const twiml = new twilio.twiml.MessagingResponse()

    try {

        const message = req.body.Body || ""
        const sender = req.body.From || ""

        console.log("WhatsApp message received")
        console.log("From:", sender)
        console.log("Message:", message)

        const reply = `Hello 👋

WhatsApp AI is working.

You said:
${message}`

        twiml.message(reply)

    } catch (error) {

        console.error("Webhook error:", error)

        twiml.message("System error.")

    }

    res.set("Content-Type", "text/xml")
    res.send(twiml.toString())

})

export default router
