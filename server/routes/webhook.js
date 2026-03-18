// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const { sendWhatsAppMessage, sendProductCTA } = require("../../integrations/whatsapp");

const { parseUserInput } = require("../../ai-engine/parser");
const { normalizePart } = require("../../ai-engine/learningNormalizer");

const { detectIntent } = require("../../conversation-engine/intentDetector");
const { getMainMenu, getAutoPartsPrompt } = require("../../conversation-engine/menu");

const {
  getSession,
  updateVehicle,
  hasVehicle,
  clearSession,
  getVehicleSummary
} = require("../../conversation-engine/stateManager");

const {
  needsClarification,
  confirmPartIfNeeded
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
    let userInput = message.text?.body?.trim();

    if (!userInput) return res.sendStatus(200);

    let session = getSession(from);

    // RESET
    if (userInput === "#") {
      clearSession(from);
      await sendWhatsAppMessage(from, getMainMenu());
      return res.sendStatus(200);
    }

    // INTENT
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

    // PARSE
    const parsed = parseUserInput(userInput);

    session = updateVehicle(from, parsed.vehicle);
    const vehicle = session.vehicle;

    if (!hasVehicle(from)) {
      await sendWhatsAppMessage(
        from,
        "Please provide vehicle details.\nExample: Toyota Corolla 2018"
      );
      return res.sendStatus(200);
    }

    const vehicleSummary = getVehicleSummary(vehicle);

    // CLARIFICATION
    const clarification = needsClarification(vehicle, parsed.parts);
    if (clarification) {
      await sendWhatsAppMessage(from, clarification.message);
      return res.sendStatus(200);
    }

    // NORMALIZE PART
    const partResult = normalizePart(parsed.parts[0].raw);

    if (partResult.source === "unknown") {
      await sendWhatsAppMessage(
        from,
        "Please specify correct part.\nExample: Brake Pads"
      );
      return res.sendStatus(200);
    }

    // MATCH
    const results = await matchProducts({
      vehicle,
      parts: parsed.parts
    });

    let productList = [];
    results.forEach(r => {
      if (r.results.length) productList.push(...r.results);
    });

    // -----------------------------
    // BUY FLOW
    // -----------------------------
    if (productList.length) {
      const topProduct = productList[0];

      await sendWhatsAppMessage(
        from,
        `Best match for: ${vehicleSummary}`
      );

      await sendProductCTA(from, topProduct);

    } else {
      const reply = formatResponse(results, vehicle);
      await sendWhatsAppMessage(from, reply);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

module.exports = router;
