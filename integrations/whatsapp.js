// integrations/whatsapp.js

const axios = require("axios");

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// -----------------------------
// TEXT MESSAGE
// -----------------------------
async function sendWhatsAppMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("WhatsApp text error:", err.response?.data || err.message);
  }
}

// -----------------------------
// 🛒 PRODUCT CARD (INTERACTIVE)
// -----------------------------
async function sendProductCards(to, products) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    const sections = products.map((p, index) => ({
      title: `Option ${index + 1}`,
      rows: [
        {
          id: `product_${index}`,
          title: p.title.substring(0, 24),
          description: `PKR ${p.price || "N/A"}`
        }
      ]
    }));

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          body: {
            text: "Select a product:"
          },
          action: {
            button: "View Products",
            sections
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("WhatsApp card error:", err.response?.data || err.message);
  }
}

module.exports = {
  sendWhatsAppMessage,
  sendProductCards
};
