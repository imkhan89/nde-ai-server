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
    let userInput = message.text?.body?.trim();

    if (!userInput) return res.sendStatus(200);

    console.log("💬 Message:", userInput);

    let session = getSession(from);

    // -----------------------------
    // RESET SESSION
    // -----------------------------
    if (userInput === "#") {
      clearSession(from);
      await sendWhatsAppMessage(from, getMainMenu());
      return res.sendStatus(200);
    }

    // -----------------------------
    // HANDLE PART CONFIRMATION RESPONSE
    // -----------------------------
    if (session.pendingPartConfirmation) {
      if (userInput.toLowerCase() === "yes") {
        // Learn only safe mappings
        if (session.pendingPartConfirmation !== "unknown") {
          learnSynonym(session.lastUserInput, session.pendingPartConfirmation);
        }

        userInput = session.pendingPartConfirmation;
        session.pendingPartConfirmation = null;
      } else {
        session.pendingPartConfirmation = null;
        await sendWhatsAppMessage(from, "Please type the correct part name.");
        return res.sendStatus(200);
      }
    }

    // -----------------------------
    // INTENT DETECTION
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
    // PARSE USER INPUT
    // -----------------------------
    const parsed = parseUserInput(userInput);

    // -----------------------------
    // UPDATE SESSION VEHICLE
    // -----------------------------
    session = updateVehicle(from, parsed.vehicle);
    const vehicle = session.vehicle;

    console.log("🚗 Session Vehicle:", vehicle);

    // -----------------------------
    // CLARIFICATION (VEHICLE / PART)
    // -----------------------------
    const clarification = needsClarification(vehicle, parsed.parts);
    if (clarification) {
      await sendWhatsAppMessage(from, clarification.message);
      return res.sendStatus(200);
    }

    // -----------------------------
    // PART NORMALIZATION (CONTROLLED)
    // -----------------------------
    const partResult = normalizePart(parsed.parts[0].raw);

    session.lastUserInput = parsed.parts[0].raw;

    // ✅ CORE MATCH → NO CONFIRMATION
    if (partResult.source === "core") {
      // proceed directly
    }
    // ⚠️ UNKNOWN → ASK USER (NO GUESSING)
    else if (partResult.source === "unknown") {
      await sendWhatsAppMessage(
        from,
        "Please specify the correct part.\nExample: Brake Pads"
      );
      return res.sendStatus(200);
    }
    // ⚠️ LEARNED / LOW CONFIDENCE → OPTIONAL CONFIRM
    else if (partResult.confidence < 70) {
      const confirm = confirmPartIfNeeded(partResult);

      if (confirm) {
        session.pendingPartConfirmation = partResult.normalized_part;
        await sendWhatsAppMessage(from, confirm.message);
        return res.sendStatus(200);
      }
    }

    // -----------------------------
    // MATCH PRODUCTS
    // -----------------------------
    const results = await matchProducts({
      vehicle,
      parts: parsed.parts
    });

    // -----------------------------
    // PREPARE PRODUCT LIST
    // -----------------------------
    let productList = [];
    results.forEach(r => {
      if (r.results.length) {
        productList.push(...r.results);
      }
    });

    // -----------------------------
    // SEND RESPONSE
    // -----------------------------
    if (productList.length) {
      await sendProductCards(from, productList);
    } else {
      const reply = formatResponse(results, vehicle);
      await sendWhatsAppMessage(from, reply);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.sendStatus(500);
  }
});

module.exports = router;
