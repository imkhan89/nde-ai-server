// integrations/whatsapp.js

const axios = require("axios");

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// -----------------------------
async function sendWhatsAppMessage(to, message) {
  try {
    console.log("📤 Sending message to:", to);
    console.log("📨 Message:", message);

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      console.error("❌ Missing WhatsApp credentials");
      return;
    }

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
          body: message
        }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ WhatsApp API response:", response.data);

  } catch (err) {
    console.error("❌ WhatsApp send error:");
    console.error(err.response?.data || err.message);
  }
}

module.exports = sendWhatsAppMessage;
