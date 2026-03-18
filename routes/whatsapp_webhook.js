import express from "express";
import axios from "axios";
import { searchProducts } from "./search_routes.js";

const router = express.Router();

// ✅ VERIFY
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === VERIFY_TOKEN
  ) {
    return res.status(200).send(req.query["hub.challenge"]);
  }
  return res.sendStatus(403);
});

// ✅ MESSAGE HANDLER (LIVE SEARCH)
router.post("/", async (req, res) => {
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;

    if (!value || !value.messages) {
      return res.sendStatus(200);
    }

    const message = value.messages[0];
    const from = message.from;

    let text = "";

    if (message.type === "text") {
      text = message.text.body;
    } else {
      return res.sendStatus(200);
    }

    const cleanText = text.toLowerCase().trim();

    console.log("Incoming:", cleanText);

    // ✅ REAL SEARCH
    let results = await searchProducts(cleanText);
    const topResults = results.slice(0, 5);

    let reply = "";

    if (!topResults.length) {
      reply =
`❌ No exact match found

Please send:
Car Model + Year + Part

Example:
Mira 2018 brake pad`;
    } else {
      reply = `🔥 Best Matches:\n\n`;

      topResults.forEach((item, i) => {
        reply += `${i + 1}. ${item.title}\n`;
        reply += `💰 Rs ${item.price}\n`;
        reply += `🔗 ${item.url}\n\n`;
      });

      reply += "Reply with product number to order.";
    }

    // ✅ SEND RESPONSE
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: reply },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.sendStatus(200);
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    return res.sendStatus(200);
  }
});

export default router;
