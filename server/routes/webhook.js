// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const sendWhatsAppMessage = require("../../integrations/whatsapp");
const { parseUserInput } = require("../../ai-engine/parser");

const { detectIntent } = require("../../conversation-engine/intentDetector");
const { getMainMenu, getAutoPartsPrompt } = require("../../conversation-engine/menu");

// -----------------------------
// VERIFY WEBHOOK
// -----------------------------
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
    return res.send(req.query["hub.challenge"]);
  }

  return res.sendStatus(403);
});

// -----------------------------
// RECEIVE MESSAGE
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
    // INTENT DETECTION
    // -----------------------------
    const intent = detectIntent(userInput);

    // -----------------------------
    // MENU / GREETING
    // -----------------------------
    if (intent === "GREETING" || intent === "MENU") {
      await sendWhatsAppMessage(from, getMainMenu());
      return res.sendStatus(200);
    }

    // -----------------------------
    // MENU SELECTION
    // -----------------------------
    if (intent === "MENU_SELECTION") {
      if (userInput === "1") {
        await sendWhatsAppMessage(from, getAutoPartsPrompt());
        return res.sendStatus(200);
      }

      await sendWhatsAppMessage(from, "This feature will be available soon.");
      return res.sendStatus(200);
    }

    // -----------------------------
    // PRODUCT FLOW
    // -----------------------------
    const parsed = parseUserInput(userInput);

    if (!parsed.vehicle.make || !parsed.vehicle.model) {
      await sendWhatsAppMessage(
        from,
        "Please provide car make, model and year.\nExample: Suzuki Swift 2021 brake pads"
      );
      return res.sendStatus(200);
    }

    const results = await matchProducts(parsed);

    const reply = formatResponse(results, parsed.vehicle);

    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
});

module.exports = router;
