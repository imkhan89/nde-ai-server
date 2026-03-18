// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const sendWhatsAppMessage = require("../../integrations/whatsapp");
const { parseUserInput } = require("../../ai-engine/parser");

const { detectIntent } = require("../../conversation-engine/intentDetector");
const { getMainMenu, getAutoPartsPrompt } = require("../../conversation-engine/menu");

const {
  getSession,
  updateVehicle,
  clearSession
} = require("../../conversation-engine/stateManager");

const {
  needsClarification
} = require("../../conversation-engine/clarifier");

// -----------------------------
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
    return res.send(req.query["hub.challenge"]);
  }

  return res.sendStatus(403);
});

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
    // SESSION
    // -----------------------------
    let session = getSession(from);

    if (userInput === "#") {
      clearSession(from);
      await sendWhatsAppMessage(from, getMainMenu());
      return res.sendStatus(200);
    }

    // -----------------------------
    // INTENT
    // -----------------------------
    const intent = detectIntent(userInput);

    if (intent === "GREETING" || intent === "MENU") {
      await sendWhatsAppMessage(from, getMainMenu());
      return res.sendStatus(200);
    }

    if (intent === "MENU_SELECTION") {
      if (userInput === "1") {
        await sendWhatsAppMessage(from, getAutoPartsPrompt());
        return res.sendStatus(200);
      }

      await sendWhatsAppMessage(from, "This feature will be available soon.");
      return res.sendStatus(200);
    }

    // -----------------------------
    // PARSE INPUT
    // -----------------------------
    const parsed = parseUserInput(userInput);

    // -----------------------------
    // UPDATE SESSION VEHICLE
    // -----------------------------
    session = updateVehicle(from, parsed.vehicle);
    const vehicle = session.vehicle;

    console.log("🚗 Session Vehicle:", vehicle);

    // -----------------------------
    // 🧠 SMART CLARIFICATION
    // -----------------------------
    const clarification = needsClarification(vehicle, parsed.parts);

    if (clarification) {
      await sendWhatsAppMessage(from, clarification.message);
      return res.sendStatus(200);
    }

    // -----------------------------
    // MATCH PRODUCTS
    // -----------------------------
    const results = await matchProducts({
      vehicle,
      parts: parsed.parts
    });

    const reply = formatResponse(results, vehicle);

    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
});

module.exports = router;
