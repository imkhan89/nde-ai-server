require("dotenv").config();

const express = require("express");
const axios = require("axios");
const twilio = require("twilio");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* =============================
ENV VARIABLES
============================= */

const PORT = process.env.PORT || 3000;

const OPENAI_KEY = process.env.OPENAI_API_KEY;

const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

/* =============================
SAFE TWILIO INITIALIZATION
============================= */

let twilioClient = null;

if (TWILIO_SID && TWILIO_TOKEN) {
  twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);
  console.log("Twilio initialized");
} else {
  console.log("Twilio credentials missing");
}

/* =============================
SESSION MEMORY
============================= */

const sessions = {};

/* =============================
HEALTH CHECK
============================= */

app.get("/", (req, res) => {
  res.send("NDE AI SERVER RUNNING");
});

/* =============================
XML SAFE
============================= */

function xmlSafe(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* =============================
OPENAI VEHICLE + PART DETECTION
============================= */

async function detectVehicle(message) {

  if (!OPENAI_KEY) return null;

  try {

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Extract vehicle information from customer message.

Return JSON only.

{
"make":"",
"model":"",
"year":"",
"part":""
}
`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 80
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`
        }
      }
    );

    const text = response.data.choices[0].message.content;

    return JSON.parse(text);

  } catch (err) {

    console.log("Vehicle detection error:", err.message);
    return null;

  }

}

/* =============================
SHOPIFY SEARCH (SCALES 10K+ PRODUCTS)
============================= */

async function shopifySearch(query) {

  try {

    const url =
`https://${SHOP}/admin/api/2024-01/products.json?title=${encodeURIComponent(query)}&limit=5`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_TOKEN
      },
      timeout: 5000
    });

    const products = response.data.products || [];

    if (products.length === 0) return null;

    const p = products[0];

    return {
      title: p.title,
      price: p.variants?.[0]?.price || "N/A",
      handle: p.handle
    };

  } catch (err) {

    console.log("Shopify error:", err.message);
    return null;

  }

}

/* =============================
SMART AUTOMOTIVE SEARCH
============================= */

async function smartProductSearch(vehicle, part) {

  if (!vehicle || !part) return null;

  let product =
    await shopifySearch(`${vehicle} ${part}`);

  if (product) return product;

  product =
    await shopifySearch(part);

  return product;

}

/* =============================
PRO SALES RESPONSE
============================= */

function salesResponse(product) {

  return `
Thank you for contacting NDE Store.

${product.title}

Price: PKR ${product.price}

Order here:
https://ndestore.com/products/${product.handle}

Delivery across Pakistan within 2–3 working days.

If you need help selecting the correct part please share your vehicle model and year.
`;

}

/* =============================
WHATSAPP WEBHOOK
============================= */

app.post("/whatsapp", async (req, res) => {

  const incomingMsg = req.body.Body || "";
  const sender = (req.body.From || "").replace("whatsapp:", "");

  if (!sessions[sender]) {
    sessions[sender] = {};
  }

  let reply =
"Welcome to NDE Store. Please share your vehicle make, model and required part.";

  try {

    const vehicleData = await detectVehicle(incomingMsg);

    if (vehicleData) {

      if (vehicleData.make) sessions[sender].make = vehicleData.make;
      if (vehicleData.model) sessions[sender].model = vehicleData.model;
      if (vehicleData.part) sessions[sender].part = vehicleData.part;
      if (vehicleData.year) sessions[sender].year = vehicleData.year;

    }

    const yearMatch = incomingMsg.match(/\b(19|20)\d{2}\b/);

    if (yearMatch) {
      sessions[sender].year = yearMatch[0];
    }

    const s = sessions[sender];

    if (s.model && s.part) {

      const vehicle =
        `${s.make || ""} ${s.model}`;

      const product =
        await smartProductSearch(vehicle, s.part);

      if (product) {

        reply = salesResponse(product);

      } else {

        reply = `
Thank you for your message.

We may have ${s.part} available for ${vehicle}.

Please confirm the model year so we can recommend the correct part.
`;

      }

    }

  } catch (err) {

    console.log("Webhook error:", err.message);

  }

  const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);

});

/* =============================
START SERVER
============================= */

app.listen(PORT, () => {

  console.log("Server running on port", PORT);

});
