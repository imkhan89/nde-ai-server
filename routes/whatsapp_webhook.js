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

// ✅ MESSAGE HANDLER
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    console.log("FULL BODY:", JSON.stringify(body)); // DEBUG

    const value = body?.entry?.[0]?.changes?.[0]?.value;

    if (!value) return res.sendStatus(200);

    // ✅ IMPORTANT: messages can be undefined (delivery receipts etc.)
    if (!value.messages) return res.sendStatus(200);

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

    // ✅ SEARCH
    let results = await searchProducts(cleanText);
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

    // ✅ SEND MESSAGE (FIXED STRUCTURE)
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "text",
        text: {
          preview_url: false,
          body: reply,
        },
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
