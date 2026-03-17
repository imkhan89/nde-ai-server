import express from "express";
import axios from "axios";
import { searchProducts } from "../services/search_pipeline.js";

const router = express.Router();

router.get("/whatsapp", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});


router.post("/whatsapp", async (req, res) => {

    try {

        const body = req.body;

        if (body.object !== "whatsapp_business_account") {
            return res.sendStatus(404);
        }

        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (!message) {
            return res.sendStatus(200);
        }

        const from = message.from;
        const text = message.text?.body || "";

        console.log("Incoming:", text);

        const results = await searchProducts(text);

        let aiReply = "";

        if (!results || results.length === 0) {

            aiReply =
`Sorry, no exact match found.

Please send:
• Car model
• Part name

Example:
Civic air filter`;

        } else {

            aiReply = `Top Matches:\n\n`;

            results.forEach((p, index) => {
                aiReply +=
`${index + 1}. ${p.title}
Rs ${p.price}
https://ndestore.com/products/${p.handle}

`;
            });

        }

        await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: from,
                text: { body: aiReply }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.sendStatus(200);

    } catch (error) {

        console.error("Webhook error:", error.response?.data || error.message);

        res.sendStatus(500);
    }

});

export default router;
