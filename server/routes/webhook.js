// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const sendWhatsAppMessage = require("../../integrations/whatsapp");
const { parseUserInput } = require("../../ai-engine/parser");

// -----------------------------
// 🔐 VERIFY WEBHOOK
// -----------------------------
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// -----------------------------
// 📩 RECEIVE MESSAGE
// -----------------------------
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    // Ignore non-message events
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const userInput = message.text?.body;

    console.log("👤 From:", from);
    console.log("💬 Message:", userInput);

    if (!userInput) {
      return res.sendStatus(200);
    }

    // -----------------------------
    // 🧠 PARSE USER INPUT
    // -----------------------------
    const parsed = parseUserInput(userInput);

    console.log("🧠 Parsed:", parsed);

    // -----------------------------
    // ⚠️ VALIDATE VEHICLE
    // -----------------------------
    if (!parsed.vehicle.make || !parsed.vehicle.model) {
      await sendWhatsAppMessage(
        from,
        "Please provide car make, model and year.\nExample: Suzuki Swift 2021 brake pads"
      );
      return res.sendStatus(200);
    }

    // -----------------------------
    // 🔍 MATCH PRODUCTS
    // -----------------------------
    const results = await matchProducts(parsed);

    console.log("🔎 Match Results:", results);

    // -----------------------------
    // 🧾 FORMAT RESPONSE
    // -----------------------------
    let reply = formatResponse(results);

    if (!results.length) {
      reply = "No exact match found. Please refine your query.";
    }

    console.log("📤 Reply:", reply);

    // -----------------------------
    // 📤 SEND WHATSAPP MESSAGE
    // -----------------------------
    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.sendStatus(500);
  }
});

module.exports = router;
