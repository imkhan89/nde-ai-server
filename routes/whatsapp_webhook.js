import express from "express"
import twilio from "twilio"

import { searchProducts } from "../services/product_search.js"

const router = express.Router()

router.post("/whatsapp", async (req, res) => {

    const twiml = new twilio.twiml.MessagingResponse()

    try {

        const message = (req.body.Body || "").trim()
        const sender = req.body.From || ""

        console.log("WhatsApp message received")
        console.log("From:", sender)
        console.log("Message:", message)

        let reply = ""

        const text = message.toLowerCase()

        if (
            text === "hello" ||
            text === "hi" ||
            text.includes("assalam")
        ) {

            reply = `Hello 👋

Welcome to ndestore.com Automotive Parts.

Try asking for:

• Civic air filter
• Corolla brake pads
• Vitz wiper blades`

        } else {

            const products = searchProducts(text)

            if (!products || products.length === 0) {

                reply = `Sorry, I couldn't find a matching product.

Try something like:

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

        twiml.message(reply)

    } catch (error) {

        console.error("Webhook error:", error)

        twiml.message("System temporarily unavailable. Please try again.")

    }

    res.type("text/xml")
    res.send(twiml.toString())

})

export default router
