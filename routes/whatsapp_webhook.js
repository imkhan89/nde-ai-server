import express from "express";
import axios from "axios";
import { searchProducts } from "../routes/search_routes.js";

const router = express.Router();

// ✅ Webhook Verification
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// ✅ Incoming Messages
router.post("/", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;

    let text = "";

    if (message.type === "text") {
      text = message.text.body;
    } else if (message.type === "button") {
      text = message.button.text;
    } else {
      text = "";
    }

    const cleanText = text.toLowerCase().trim();

    console.log("Incoming:", { from, cleanText });

    // ✅ SEARCH PRODUCTS
    let results = [];
    if (cleanText) {
      results = await searchProducts(cleanText);
    }

    // ✅ LIMIT RESULTS (MAX 5)
    results = results?.slice(0, 5) || [];

    let reply = "";

    // ✅ NO RESULTS HANDLING
    if (!results.length) {
      reply =
`We couldn’t find exact match.

Please share:
• Car model
• Year
• Part name

Example:
Mira 2018 brake pad`;
    } else {
      reply = "Here are best matching products:\n\n";

      results.forEach((item, index) => {
        reply += `${index + 1}. ${item.title}\n`;
        reply += `Rs ${item.price}\n`;
        reply += `${item.url}\n\n`;
      });

      reply += "Reply with product number to order.";
    }

    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.sendStatus(500);
  }
});

// ✅ Send WhatsApp Message
async function sendWhatsAppMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  for (let i = 0; i < 3; i++) {
    try {
      await axios.post(
        url,
        {
          messaging_product: "whatsapp",
          to,
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      return;
    } catch (error) {
      if (i === 2) throw error;
    }
  }
}

export default router;
