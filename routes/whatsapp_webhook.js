import express from "express";
import axios from "axios";
import { searchProducts } from "./search_routes.js";

const router = express.Router();

// ✅ SIMPLE MEMORY (PER USER)
const userSessions = {};

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
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;

    let text = "";
    if (message.type === "text") text = message.text.body;
    else if (message.type === "button") text = message.button.text;

    const cleanText = text.toLowerCase().trim();

    console.log("Incoming:", { from, cleanText });

    // ✅ INIT SESSION
    if (!userSessions[from]) {
      userSessions[from] = {
        lastQuery: "",
        lastResults: [],
      };
    }

    // ✅ HANDLE ORDER (USER REPLIES 1,2,3...)
    if (!isNaN(cleanText)) {
      const index = parseInt(cleanText) - 1;
      const selected = userSessions[from].lastResults[index];

      if (selected) {
        const reply =
`✅ Order Confirmed

${selected.title}
Rs ${selected.price}

Open link to checkout:
${selected.url}

Cash on Delivery available.`;

        await sendWhatsAppMessage(from, reply);
        return res.sendStatus(200);
      }
    }

    // ✅ SEARCH PRODUCTS
    const results = await searchProducts(cleanText);

    const topResults = results.slice(0, 5);

    // ✅ SAVE SESSION
    userSessions[from].lastQuery = cleanText;
    userSessions[from].lastResults = topResults;

    let reply = "";

    if (!topResults.length) {
      reply =
`No exact match found.

Please send:
Car + Model + Part

Example:
Mira 2018 brake pad`;
    } else {
      reply = `Top Results:\n\n`;

      topResults.forEach((item, i) => {
        reply += `${i + 1}. ${item.title}\n`;
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

// ✅ SEND MESSAGE
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
