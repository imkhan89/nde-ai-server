// server.js

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const catalogEngine = require("./shopify_catalog_sync_engine");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

/*
---------------------------------------
WHATSAPP CLOUD API CONFIG
---------------------------------------
*/

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

/*
---------------------------------------
VERIFY WEBHOOK (META REQUIREMENT)
---------------------------------------
*/

app.get("/webhook", (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }

});

/*
---------------------------------------
RECEIVE WHATSAPP MESSAGES
---------------------------------------
*/

app.post("/webhook", async (req, res) => {

    try {

        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (!message) {
            return res.sendStatus(200);
        }

        const from = message.from;
        const text = message.text?.body || "";

        console.log("User Message:", text);

        const results = catalogEngine.searchProducts(text);

        let reply = "";

        if (results.length === 0) {

            reply =
`No matching products found.

Send request in this format:
Part + Make + Model + Year

Example:
Brake Pads Toyota Corolla 2018`;

        } else {

            reply = "Top Results:\n\n";

            results.forEach(p => {

                const url = `https://ndestore.com/products/${p.handle}`;

                reply += `${p.title}\n${url}\n\n`;

            });

        }

        await sendWhatsAppMessage(from, reply);

        res.sendStatus(200);

    } catch (error) {

        console.error("Webhook Error:", error);

        res.sendStatus(500);

    }

});

/*
---------------------------------------
SEND WHATSAPP MESSAGE
---------------------------------------
*/

async function sendWhatsAppMessage(to, text) {

    try {

        const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

        await axios.post(
            url,
            {
                messaging_product: "whatsapp",
                to: to,
                text: { body: text }
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {

        console.error("WhatsApp Send Error:", error.response?.data || error.message);

    }

}

/*
---------------------------------------
SERVER START
---------------------------------------
*/

app.listen(PORT, async () => {

    console.log("Server running on port:", PORT);

    await catalogEngine.startCatalogSync();

});
