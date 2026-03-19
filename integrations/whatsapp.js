const axios = require("axios");

const PHONE_NUMBER_ID =
  process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.PHONE_NUMBER_ID;

const ACCESS_TOKEN =
  process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;

async function sendWhatsAppMessage(to, message) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    throw new Error("Missing WhatsApp credentials in environment variables.");
  }

  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: String(message || "") }
    },
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

module.exports = {
  sendWhatsAppMessage
};
