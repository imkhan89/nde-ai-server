// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const { sendWhatsAppMessage, sendProductCards } = require("../../integrations/whatsapp");

const { parseUserInput } = require("../../ai-engine/parser");
const { normalizePart, learnSynonym } = require("../../ai-engine/learningNormalizer");

const { detectIntent } = require("../../conversation-engine/intentDetector");
const { getMainMenu, getAutoPartsPrompt } = require("../../conversation-engine/menu");

const {
  getSession,
  updateVehicle,
  clearSession
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
    let userInput = message.text?.body?.trim().toLowerCase();

    if (!userInput) return res.sendStatus(200);

    console.log("💬 Message:", userInput);

    let session = getSession(from);

    // RESET
    if (userInput === "#") {
      clearSession(from);
      await sendWhatsAppMessage(from, getMainMenu());
      return res.sendStatus(200);
    }

    // -----------------------------
    // HANDLE CONFIRMATION RESPONSE
    // -----------------------------
    if (session.pendingPartConfirmation) {
      if (userInput === "yes") {
        // ✅ LEARN USER INPUT
        learnSynonym(session.lastUserInput, session.pendingPartConfirmation);

        userInput = session.pendingPartConfirmation;
        session.pendingPartConfirmation = null;
      } else {
        session.pendingPartConfirmation = null;
        await sendWhatsAppMessage(from, "Please type the correct part name.");
        return res.sendStatus(200);
      }
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
    // PARSE
    // -----------------------------
    const parsed = parseUserInput(userInput);

    session = updateVehicle(from, parsed.vehicle);
    const vehicle = session.vehicle;

    // -----------------------------
    // CLARIFICATION
    // -----------------------------
    const clarification = needsClarification(vehicle, parsed.parts);
    if (clarification) {
      await sendWhatsAppMessage(from, clarification.message);
      return res.sendStatus(200);
    }

    // -----------------------------
    // PART NORMALIZATION
    // -----------------------------
    const partResult = normalizePart(parsed.parts[0].raw);

    session.lastUserInput = parsed.parts[0].raw;

    if (partResult.confidence < 60) {
      const confirm = confirmPartIfNeeded(partResult);

      if (confirm) {
        session.pendingPartConfirmation = partResult.normalized_part;
        await sendWhatsAppMessage(from, confirm.message);
        return res.sendStatus(200);
      }
    }

    // -----------------------------
    // MATCH
    // -----------------------------
    const results = await matchProducts({
      vehicle,
      parts: parsed.parts
    });

    let productList = [];
    results.forEach(r => {
      if (r.results.length) productList.push(...r.results);
    });

    if (productList.length) {
      await sendProductCards(from, productList);
    } else {
      const reply = formatResponse(results, vehicle);
      await sendWhatsAppMessage(from, reply);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
});

module.exports = router;
