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
    "🚗 *NDE Auto Parts*\n\n" +
    "Please choose:\n\n" +
    "1️⃣ Search Parts\n" +
    "2️⃣ Browse Categories\n" +
    "3️⃣ Support\n\n" +
    "💬 Example:\n*Air Filter Honda Civic 2018*\n\n" +
    "Reply *#* anytime for menu"
  );
}

// ==============================
// VERIFY
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
    // MENU
    // ==============================
    if (["hi","hello","start","#","menu"].includes(lower)) {
      await sendWhatsAppMessage(from, mainMenu());
      return res.sendStatus(200);
    }

    // ==============================
    // OPTION 1
    // ==============================
    if (lower === "1") {
      await sendWhatsAppMessage(
        from,
        "🔍 Send:\n*Part + Make + Model + Year*\n\nExample:\n*Air Filter Honda Civic 2018*"
      );
      return res.sendStatus(200);
    }

    // ==============================
    // SEARCH FLOW
    // ==============================
    const parsed = parseUserInput(text);

    const { make, model, year } = parsed.vehicle;

    let part = parsed.parts?.[0]?.raw;
    if (!part) part = text;

    if (!make || !model) {
      await sendWhatsAppMessage(
        from,
        "⚠️ Please send complete details\n\nExample:\n*Air Filter Honda Civic 2018*\n\nReply *#* for menu"
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

    await sendWhatsAppMessage(from, reply);

    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.sendStatus(200);
  }
});

module.exports = router;
