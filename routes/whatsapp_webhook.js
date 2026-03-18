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

// ✅ MESSAGE HANDLER (FULL SAFE)
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    // ✅ SAFETY CHECK (prevents 500 crash)
    if (!body?.entry?.[0]?.changes?.[0]?.value) {
      return res.sendStatus(200);
    }

    const value = body.entry[0].changes[0].value;

    if (!value.messages) {
      return res.sendStatus(200);
    }

    const message = value.messages[0];
    const from = message.from;

    let text = "";

    if (message.type === "text") {
      text = message.text.body;
    } else if (message.type === "button") {
      text = message.button.text;
    } else {
      return res.sendStatus(200); // ignore unsupported
    }

    const cleanText = text.toLowerCase().trim();

    console.log("Incoming:", cleanText);

    // ✅ SEARCH (SAFE)
    let results = [];
    try {
      results = await searchProducts(cleanText);
    } catch (err) {
      console.error("Search failed:", err.message);
      results = [];
    }

    const topResults = results.slice(0, 5);

    let reply = "";

    if (!topResults.length) {
      reply = "No products found. Try: Mira brake pad";
    } else {
      reply = "Top Results:\n\n";

      topResults.forEach((item, i) => {
        reply += `${i + 1}. ${item.title}\n`;
        reply += `Rs ${item.price}\n`;
        reply += `${item.url}\n\n`;
      });
    }

    // ✅ SEND MESSAGE SAFE
    try {
      await sendWhatsAppMessage(from, reply);
    } catch (err) {
      console.error("Send failed:", err.response?.data || err.message);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook crash:", error.message);
    return res.sendStatus(200); // NEVER return 500 to Meta
  }
});

// ✅ SEND FUNCTION
async function sendWhatsAppMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  return axios.post(
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
}

export default router;
