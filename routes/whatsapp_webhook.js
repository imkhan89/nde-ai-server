import express from "express"
import twilio from "twilio"

const router = express.Router()

router.post("/whatsapp", async (req, res) => {

    try {

        const incomingMsg = req.body.Body || ""
        const from = req.body.From || ""

        console.log("WhatsApp Message Received")
        console.log("From:", from)
        console.log("Message:", incomingMsg)

        const twiml = new twilio.twiml.MessagingResponse()

        let reply = ""

        const msg = incomingMsg.toLowerCase()

        if (msg.includes("hello") || msg.includes("hi")) {

            reply = "Hello 👋\nWelcome to ndestore.com Automotive Parts.\nHow can I assist you today?"

        } else {

            reply = "Thank you for contacting ndestore.com.\nOur AI is processing your request."

        }

        twiml.message(reply)

        res.type("text/xml")
        res.send(twiml.toString())

    } catch (error) {

        console.error("Webhook Error:", error)

        res.sendStatus(200)

    }

})

export default router
