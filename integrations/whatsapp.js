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
    console.error("❌ WhatsApp text error:", err.response?.data || err.message);
  }
}

// -----------------------------
// 🛒 PRODUCT CTA BUTTON (BUY NOW)
// -----------------------------
async function sendProductCTA(to, product) {
  try {
    const url = `https://${process.env.SHOPIFY_DOMAIN}/products/${product.handle}`;

    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: `${product.title}\nPrice: PKR ${product.price || "N/A"}`
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "buy_now",
                  title: "Buy Now"
                }
              }
            ]
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

    // Send checkout link separately
    await sendWhatsAppMessage(to, `Buy here:\n${url}`);

  } catch (err) {
    console.error("❌ CTA error:", err.response?.data || err.message);
  }
}

module.exports = {
  sendWhatsAppMessage,
  sendProductCTA
};
