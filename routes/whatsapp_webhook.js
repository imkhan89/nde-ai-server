import express from "express"
import twilio from "twilio"

const router = express.Router()

router.post("/whatsapp", (req, res) => {

    const incomingMessage = req.body.Body || ""
    const sender = req.body.From || ""

    console.log("WhatsApp message received")
    console.log("From:", sender)
    console.log("Message:", incomingMessage)

    const twiml = new twilio.twiml.MessagingResponse()

    let reply

    const msg = incomingMessage.toLowerCase()

    if (msg.includes("hello") || msg.includes("hi")) {

        reply =
`Hello 👋
Welcome to ndestore.com Automotive Parts.

You can ask me about:

• Brake Pads
• Air Filters
• Oil Filters
• Wiper Blades
• Car Accessories`

    } else {

        reply =
`Thank you for contacting ndestore.com.

Our automotive AI is processing your request.
Please wait while we find the best products.`

    }

    twiml.message(reply)

    res.writeHead(200, { "Content-Type": "text/xml" })
    res.end(twiml.toString())

})

export default router
