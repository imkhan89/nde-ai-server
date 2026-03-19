const express = require("express");
const router = express.Router();

const { parseUserInput } = require("../ai-engine/parser");
const { searchFitment, formatResponse } = require("../fitmentService");
const { sendWhatsAppMessage } = require("../integrations/whatsapp");

function mainMenu() {
  return (
    "NDE AI Menu\n\n" +
    "Send:\n" +
    "• Part + Make + Model + Year\n\n" +
    "Example:\n" +
    "Air Filter Honda Civic 2018\n\n" +
    "Reply # to return to main menu."
  );
}

router.get("/", (req, res) => {
  const VERIFY_TOKEN =
    process.env.WHATSAPP_VERIFY_TOKEN || process.env.VERIFY_TOKEN;

  if (req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === VERIFY_TOKEN) {
    return res.status(200).send(req.query["hub.challenge"]);
  }

  return res.sendStatus(403);
});

router.post("/", async (req, res) => {
  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    if (message.type !== "text") {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = String(message.text?.body || "").trim();

    if (!text) {
      return res.sendStatus(200);
    }

    const lower = text.toLowerCase();

    if (lower === "#" || lower === "menu" || lower === "main menu" || lower === "start" || lower === "hi" || lower === "hello") {
      await sendWhatsAppMessage(from, mainMenu());
      return res.sendStatus(200);
    }

    const parsed = parseUserInput(text);
    const { make, model, year } = parsed.vehicle;
    const part = parsed.parts?.[0]?.raw || "";

    if (!make || !model || !year || !part) {
      const missing = [];
      if (!part) missing.push("part name");
      if (!make) missing.push("vehicle make");
      if (!model) missing.push("vehicle model");
      if (!year) missing.push("model year");

      const reply =
        `Please provide: ${missing.join(", ")}\n\n` +
        `Example:\nAir Filter Honda Civic 2018`;

      await sendWhatsAppMessage(from, reply);
      return res.sendStatus(200);
    }

    const results = searchFitment({
      part,
      make,
      model,
      year
    });

    const vehicleLabel = `${make} ${model} ${year}`;
    const reply = formatResponse(results, vehicleLabel, part);

    await sendWhatsAppMessage(from, reply);
    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.response?.data || err.message);
    return res.sendStatus(200);
  }
});

module.exports = router;
