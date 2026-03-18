import express from "express";
import axios from "axios";

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

// ✅ MESSAGE HANDLER (MINIMAL — DEBUG MODE)
router.post("/", async (req, res) => {
  try {
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;

    console.log("BODY:", JSON.stringify(req.body));

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

    console.log("FROM:", from);
    console.log("TEXT:", text);

    // ✅ FORCE SIMPLE REPLY (NO SEARCH)
    const reply = "Test reply working ✅";

    // ✅ SEND MESSAGE (SIMPLIFIED)
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: {
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

    console.log("META RESPONSE:", response.data);

    return res.sendStatus(200);
  } catch (error) {
    console.error("SEND ERROR:", error.response?.data || error.message);
    return res.sendStatus(200);
  }
});

export default router;
