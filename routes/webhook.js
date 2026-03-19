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
    "🚗 *NDE Auto Parts Assistant*\n\n" +
    "Please choose an option:\n\n" +
    "1️⃣ Search by Part + Vehicle\n" +
    "2️⃣ Browse Categories\n" +
    "3️⃣ Talk to Support\n\n" +
    "💬 Example:\nAir Filter Honda Civic 2018\n\n" +
    "Reply # anytime to return to menu"
  );
}

// ==============================
// CATEGORY MENU
// ==============================
function categoryMenu() {
  return (
    "📦 *Categories*\n\n" +
    "1️⃣ Engine Parts\n" +
    "2️⃣ Suspension Parts\n" +
    "3️⃣ Brake Parts\n" +
    "4️⃣ Filters\n\n" +
    "Reply # to go back"
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
    // OPTION 1 → SEARCH
    // ==============================
    if (lower === "1") {
      await sendWhatsAppMessage(
        from,
        "🔍 Send Part + Make + Model + Year\nExample:\nAir Filter Honda Civic 2018"
      );
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 2 → CATEGORY
    // ==============================
    if (lower === "2") {
      await sendWhatsAppMessage(from, categoryMenu());
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 3 → SUPPORT
    // ==============================
    if (lower === "3") {
      await sendWhatsAppMessage(
        from,
        "📞 Our support team will contact you shortly.\nOr call: +92-XXX-XXXXXXX"
      );
      return res.sendStatus(200);
    }

    // ==============================
    // CATEGORY SUB OPTIONS
    // ==============================
    if (["engine", "engine parts", "1"].includes(lower)) {
      await sendWhatsAppMessage(from, "⚙️ Engine Parts:\nAir Filter\nOil Filter\nRadiator");
      return res.sendStatus(200);
    }

    if (["brake", "brake parts", "3"].includes(lower)) {
      await sendWhatsAppMessage(from, "🛑 Brake Parts:\nBrake Pad\nBrake Disc\nBrake Shoe");
      return res.sendStatus(200);
    }

    // ==============================
    // FITMENT SEARCH (DEFAULT)
    // ==============================
    const parsed = parseUserInput(text);

    const { make, model, year } = parsed.vehicle;

    let part = parsed.parts?.[0]?.raw;
    if (!part) part = text;

    // if missing data
    if (!make || !model) {
      await sendWhatsAppMessage(
        from,
        "⚠️ Please send complete details:\nPart + Make + Model + Year\n\nExample:\nAir Filter Honda Civic 2018\n\nReply # for menu"
      );
      return res.sendStatus(200);
    }

    const results = searchFitment({
      part,
      make,
      model,
      year
    });

    const reply = formatResponse(
      results,
      `${make} ${model} ${year}`,
      part
    );

    await sendWhatsAppMessage(from, reply + "\n\nReply # for main menu");

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ Webhook Error:", err.response?.data || err.message);
    return res.sendStatus(200);
  }
});

module.exports = router;
