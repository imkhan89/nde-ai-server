const express = require("express");
const router = express.Router();

const { parseUserInput } = require("../ai-engine/parser");
const { searchFitment, formatResponse } = require("../fitmentService");
const { sendWhatsAppMessage } = require("../integrations/whatsapp");

router.post("/", async (req, res) => {
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg || msg.type !== "text") return res.sendStatus(200);

    const text = msg.text.body;
    const from = msg.from;

    const parsed = parseUserInput(text);

    const { make, model, year } = parsed.vehicle;

    let part = parsed.parts?.[0]?.raw;
    if (!part) part = text;

    if (!make || !model) {
      await sendWhatsAppMessage(from, "Send: Part + Make + Model + Year");
      return res.sendStatus(200);
    }

    const results = searchFitment({
      part,
      make,
      model,
      year
    });

    const reply = formatResponse(results, `${make} ${model} ${year}`, part);

    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.sendStatus(200);
  }
});

module.exports = router;
