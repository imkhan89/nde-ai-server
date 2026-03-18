// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const sendWhatsAppMessage = require("../../integrations/whatsapp");
const { parseUserInput } = require("../../ai-engine/parser");

const { detectIntent } = require("../../conversation-engine/intentDetector");
const { getMainMenu } = require("../../conversation-engine/menu");

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
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const userInput = message.text?.body?.trim();

    if (!userInput) return res.sendStatus(200);

    console.log("💬 Message:", userInput);

    // -----------------------------
    // 🧠 INTENT DETECTION
    // -----------------------------
    const intent = detectIntent(userInput);

    // -----------------------------
    // 📋 GREETING / MENU
    // -----------------------------
    if (intent === "GREETING" || intent === "MENU") {
      const menu = getMainMenu();
      await sendWhatsAppMessage(from, menu);
      return res.sendStatus(200);
    }

    // -----------------------------
    // 🔢 MENU SELECTION (1–6)
    // -----------------------------
    if (intent === "MENU_SELECTION") {
      await sendWhatsAppMessage(
        from,
        "Please describe your requirement.\nExample: Suzuki Swift 2021 brake pads"
      );
      return res.sendStatus(200);
    }

    // -----------------------------
    // 🧠 PARSE INPUT
    // -----------------------------
    const parsed = parseUserInput(userInput);

    console.log("🧠 Parsed:", parsed);

    // -----------------------------
    // ⚠️ VEHICLE VALIDATION
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
