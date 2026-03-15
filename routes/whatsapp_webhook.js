import express from "express"
import twilio from "twilio"

import { searchProducts } from "../services/product_search.js"

const router = express.Router()

router.post("/whatsapp", async (req, res) => {

    try {

        const incomingMessage = (req.body.Body || "").trim()
        const sender = req.body.From || ""

        console.log("WhatsApp message received")
        console.log("From:", sender)
        console.log("Message:", incomingMessage)

        const message = incomingMessage.toLowerCase()

        let reply = ""

        if (
            message === "hi" ||
            message === "hello" ||
            message.includes("assalam")
        ) {

            reply = `Hello 👋

Welcome to ndestore.com Automotive Parts.

You can ask for parts like:

• Civic air filter
• Corolla brake pads
• Vitz wiper blades`

        } else {

            const products = searchProducts(message)

            if (!products || products.length === 0) {

                reply = `Sorry, I could not find a matching product.

Try searching like:

• Civic air filter
• Corolla brake pads`

            } else {

                reply = "Here are the best options:\n\n"

                products.slice(0,3).forEach((p,i)=>{

                    reply += `${i+1}️⃣ ${p.title}
Price: PKR ${p.price}

https://ndestore.com/products/${p.handle}

`

                })

            }

        }

        const twiml = new twilio.twiml.MessagingResponse()
        twiml.message(reply)

        res.set("Content-Type", "text/xml")
        res.status(200).send(twiml.toString())

    } catch (error) {

        console.error("Webhook error:", error)

        const twiml = new twilio.twiml.MessagingResponse()
        twiml.message("System is temporarily unavailable. Please try again.")

        res.set("Content-Type", "text/xml")
        res.status(200).send(twiml.toString())

    }

})

export default router
