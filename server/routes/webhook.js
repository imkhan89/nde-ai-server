// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const sendWhatsAppMessage = require("../../integrations/whatsapp");
const { extractVehicle } = require("../../ai-engine/parser");

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
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const userInput = message.text?.body;

    // -----------------------------
    // 🚗 PARSE VEHICLE
    // -----------------------------
    const vehicle = extractVehicle(userInput);

    // -----------------------------
    // ⚠️ VALIDATION
    // -----------------------------
    if (!vehicle.make || !vehicle.model) {
      await sendWhatsAppMessage(
        from,
        "Please provide your car make, model, and year.\nExample: Suzuki Swift 2021 brake pads"
      );
      return res.sendStatus(200);
    }

    // -----------------------------
    // 🔍 MATCH PRODUCTS
    // -----------------------------
    const products = await matchProducts(userInput, vehicle);

    // -----------------------------
    // 🧾 FORMAT RESPONSE
    // -----------------------------
    let reply = formatResponse(products);

    if (!products.length) {
      reply = "No exact match found. Please уточнить part or year.";
    }

    // -----------------------------
    // 📤 SEND MESSAGE
    // -----------------------------
    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
});

module.exports = router;
