// server/routes/webhook.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");
const { sendWhatsAppMessage } = require("../../integrations/whatsapp");

const { parseUserInput } = require("../../ai-engine/parser");
const { normalizePart, learnSynonym } = require("../../ai-engine/learningNormalizer");

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

const {
  addToCart,
  getCart,
  clearCart,
  getCartSummary
} = require("../../conversation-engine/cartManager");

const { generateCheckoutLink } = require("../../integrations/shopifyCheckout");

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
    // RESET
    // -----------------------------
    if (userInput === "#") {
      clearSession(from);
      await sendWhatsAppMessage(from, getMainMenu());
      return res.sendStatus(200);
    }

    // -----------------------------
    // CART COMMANDS
    // -----------------------------
    if (userInput.toLowerCase() === "cart") {
      const summary = getCartSummary(from);
      await sendWhatsAppMessage(from, summary);
      return res.sendStatus(200);
    }

    if (userInput.toLowerCase() === "checkout") {
      const cart = getCart(from);

      if (!cart.length) {
        await sendWhatsAppMessage(from, "Your cart is empty.");
        return res.sendStatus(200);
      }

      const link = generateCheckoutLink(cart);

      await sendWhatsAppMessage(
        from,
        `Proceed to checkout:\n${link}`
      );

      clearCart(from);
      return res.sendStatus(200);
    }

    // -----------------------------
    // PRODUCT SELECTION
    // -----------------------------
    if (/^\d+$/.test(userInput)) {
      const index = parseInt(userInput) - 1;

      if (session.lastProducts && session.lastProducts[index]) {
        const product = session.lastProducts[index];

        addToCart(from, product);

        await sendWhatsAppMessage(
          from,
          `✅ Added to cart:\n${product.title}\n\nType "checkout" to buy`
        );

        return res.sendStatus(200);
      }
    }

    // -----------------------------
    // PART CONFIRMATION
    // -----------------------------
    if (session.pendingPartConfirmation) {
      if (userInput.toLowerCase() === "yes") {
        if (session.pendingPartConfirmation !== "unknown") {
          learnSynonym(session.lastUserInput, session.pendingPartConfirmation);
        }

        userInput = session.pendingPartConfirmation;
        session.pendingPartConfirmation = null;
      } else {
        session.pendingPartConfirmation = null;
        await sendWhatsAppMessage(from, "Please type correct part name.");
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
    // PARSE INPUT
    // -----------------------------
    const parsed = parseUserInput(userInput);

    // -----------------------------
    // VEHICLE MEMORY
    // -----------------------------
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

    if (partResult.source === "unknown") {
      await sendWhatsAppMessage(
        from,
        "Please specify correct part.\nExample: Brake Pads"
      );
      return res.sendStatus(200);
    }

    if (partResult.source !== "core" && partResult.confidence < 70) {
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

    let productList = [];
    results.forEach(r => {
      if (r.results.length) productList.push(...r.results);
    });

    // -----------------------------
    // RESPONSE (CART FLOW)
    // -----------------------------
    if (productList.length) {

      let msg = `Showing results for: ${vehicleSummary}\n\n`;

      productList.slice(0, 5).forEach((p, i) => {
        msg += `${i + 1}. ${p.title} - PKR ${p.price}\n`;
      });

      msg += `\nReply with number to add to cart\nType "checkout" to buy`;

      session.lastProducts = productList;

      await sendWhatsAppMessage(from, msg);

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
