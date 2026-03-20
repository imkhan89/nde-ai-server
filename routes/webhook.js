const express = require("express");
const router = express.Router();

const { parseUserInput } = require("../ai-engine/parser");
const { searchFitment, formatResponse } = require("../fitmentService");
const { sendWhatsAppMessage } = require("../integrations/whatsapp");

// ==============================
// MAIN MENU
// ==============================
function mainMenu() {
  return (
    "Welcome to ndestore.com AI Support\n\n" +
    "1 Auto Parts\n" +
    "2 Car Accessories\n" +
    "3 Sticker Decals\n" +
    "4 Order Status\n" +
    "5 Chat Support\n" +
    "6 Complaints\n\n" +
    "Reply with 1-6 to continue."
  );
}

// ==============================
// AUTO PARTS FORM (FIXED)
// ==============================
function autoPartsForm() {
  return (
    "Auto Parts Inquiry\n\n" +
    "Share details:\n" +
    "Part Name:\n" +
    "Make:\n" +
    "Model:\n" +
    "Year:\n\n" +
    "Example:\n" +
    "Air Filter Suzuki Swift 2021\n\n" +
    "Reply # to return to Main Menu."
  );
}

// ==============================
// VERIFY WEBHOOK
// ==============================
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === VERIFY_TOKEN
  ) {
    return res.status(200).send(req.query["hub.challenge"]);
  }

  return res.sendStatus(403);
});

// ==============================
// MESSAGE HANDLER
// ==============================
router.post("/", async (req, res) => {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg || msg.type !== "text") return res.sendStatus(200);

    const text = msg.text.body.trim();
    const from = msg.from;
    const lower = text.toLowerCase();

    // ==============================
    // MENU TRIGGERS
    // ==============================
    if (
      lower === "hi" ||
      lower === "hello" ||
      lower === "start" ||
      lower === "#" ||
      lower === "menu"
    ) {
      await sendWhatsAppMessage(from, mainMenu());
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 1 → AUTO PARTS (FIXED)
    // ==============================
    if (lower === "1") {
      await sendWhatsAppMessage(from, autoPartsForm());
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 2 → ACCESSORIES
    // ==============================
    if (lower === "2") {
      await sendWhatsAppMessage(
        from,
        "Car Accessories\n\nhttps://www.ndestore.com/collections/accessories\n\nReply # to return to Main Menu."
      );
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 3 → DECALS
    // ==============================
    if (lower === "3") {
      await sendWhatsAppMessage(
        from,
        "Sticker Decals\n\nhttps://www.ndestore.com/collections/stickers\n\nReply # to return to Main Menu."
      );
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 4 → ORDER STATUS
    // ==============================
    if (lower === "4") {
      await sendWhatsAppMessage(
        from,
        "Please share your Order ID to check status.\n\nReply # to return to Main Menu."
      );
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 5 → SUPPORT
    // ==============================
    if (lower === "5") {
      await sendWhatsAppMessage(
        from,
        "Our support team will contact you shortly.\n\nReply # to return to Main Menu."
      );
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 6 → COMPLAINT
    // ==============================
    if (lower === "6") {
      await sendWhatsAppMessage(
        from,
        "Please describe your issue.\n\nReply # to return to Main Menu."
      );
      return res.sendStatus(200);
    }

    // ==============================
    // FITMENT SEARCH
    // ==============================
    const parsed = parseUserInput(text);

    const { make, model, year } = parsed.vehicle;

    let part = parsed.parts?.[0]?.raw;
    if (!part) part = text;

    if (!make || !model) {
      await sendWhatsAppMessage(from, autoPartsForm());
      return res.sendStatus(200);
    }

    const results = searchFitment({
      part,
      make,
      model,
      year
    });

    let reply = formatResponse(
      results,
      `${make} ${model} ${year}`,
      part
    );

    reply += "\n\nReply # to return to Main Menu.";

    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.sendStatus(200);
  }
});

module.exports = router;
