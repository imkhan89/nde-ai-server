const express = require("express");
const router = express.Router();

const { parseUserInput } = require("../ai-engine/parser");
const { searchFitment, formatResponse } = require("../fitmentService");
const { sendWhatsAppMessage } = require("../integrations/whatsapp");

// ✅ VERIFY TOKEN (REQUIRED FOR META)
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ✅ RECEIVE MESSAGE
router.post("/", async (req, res) => {
  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    if (message.type !== "text") return res.sendStatus(200);

    const text = message.text.body;
    const from = message.from;

    const parsed = parseUserInput(text);

    const { make, model, year } = parsed.vehicle;

    let part = parsed.parts?.[0]?.raw;
    if (!part) part = text;

    if (!make || !model) {
      await sendWhatsAppMessage(from, "Send: Part + Make + Model + Year\nExample: Air Filter Honda Civic 2018");
      return res.sendStatus(200);
    }

    const results = searchFitment({
      part,
      make,
      model,
      year
    });

    const reply = formatResponse(results, `${make} ${model} ${year}`, part);

    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ Webhook Error:", err.response?.data || err.message);
    return res.sendStatus(200);
  }
});

module.exports = router;
