import express from "express"
import twilio from "twilio"

import { searchProducts } from "../services/product_search.js"

const router = express.Router()

router.post("/whatsapp", async (req, res) => {

    try {

        const message = (req.body.Body || "").toLowerCase()
        const sender = req.body.From || ""

        console.log("WhatsApp message received")
        console.log("From:", sender)
        console.log("Message:", message)

        const twiml = new twilio.twiml.MessagingResponse()

        let reply = ""

        if (
            message.includes("hello") ||
            message.includes("hi") ||
            message.includes("assalam")
        ) {

            reply = `Hello 👋

Welcome to ndestore.com Automotive Parts.

You can ask me about:

• Brake Pads
• Air Filters
• Oil Filters
• Wiper Blades
• Car Accessories

Example:
"Civic air filter"`

        } else {

            const products = searchProducts(message)

            if (products.length === 0) {

                reply = `Sorry, I couldn't find a matching product.

Please try something like:

• Civic air filter
• Corolla brake pads
• Vitz wiper blades`

            } else {

                reply = "Here are the best options:\n\n"

                products.slice(0,3).forEach((p, i) => {

                    reply += `${i+1}️⃣ ${p.title}
Price: PKR ${p.price}

https://ndestore.com/products/${p.handle}

`

                })

                reply += "Reply with product number to order."

            }

        }

        twiml.message(reply)

        res.type("text/xml").send(twiml.toString())

    } catch (error) {

        console.error("Webhook Error:", error)

        res.sendStatus(200)

    }

})

export default router
