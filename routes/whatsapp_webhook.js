import express from "express"
import twilio from "twilio"

const router = express.Router()

router.post("/whatsapp", async (req, res) => {

    try {

        const incomingMessage = req.body.Body || ""
        const sender = req.body.From || ""

        console.log("WhatsApp message received")
        console.log("From:", sender)
        console.log("Message:", incomingMessage)

        const twiml = new twilio.twiml.MessagingResponse()

        let reply

        const msg = incomingMessage.toLowerCase()

        if (msg.includes("hello") || msg.includes("hi")) {

            reply = `Hello 👋
Welcome to ndestore.com Automotive Parts.

Ask me about:

• Brake Pads
• Air Filters
• Oil Filters
• Wiper Blades
• Car Accessories`

        } else {

            reply = `Thank you for contacting ndestore.com.

Our automotive AI is processing your request.`

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
