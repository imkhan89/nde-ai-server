import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Webhook Verification
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
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
      text = "unsupported";
    }

    console.log("Incoming:", { from, text });

    const reply = `You said: ${text}`;

    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.sendStatus(500);
  }
});

// ✅ Send WhatsApp Message (Retry Logic)
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
