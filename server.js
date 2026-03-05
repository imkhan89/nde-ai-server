require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOP_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

let PRODUCTS = [];

/* -----------------------------
TYPO + SYNONYM ENGINE
----------------------------- */

const SYNONYMS = {
  corola: "corolla",
  civc: "civic",
  vipr: "wiper",
  viper: "wiper",
  break: "brake",
  plug: "spark plug",
  plugs: "spark plug",
  cover: "car top cover"
};

function normalize(text) {
  let t = text.toLowerCase();

  Object.keys(SYNONYMS).forEach((k) => {
    t = t.replace(new RegExp(k, "g"), SYNONYMS[k]);
  });

  return t.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

/* -----------------------------
LOAD SHOPIFY CATALOG
----------------------------- */

async function loadProducts() {
  try {
    let since_id = 0;

    while (true) {
      const res = await axios.get(
        `https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`,
        {
          params: { limit: 250, since_id },
          headers: { "X-Shopify-Access-Token": SHOP_TOKEN }
        }
      );

      const items = res.data.products || [];

      if (!items.length) break;

      since_id = items[items.length - 1].id;

      items.forEach((p) => {
        PRODUCTS.push({
          title: (p.title || "").toLowerCase(),
          handle: p.handle
        });
      });

      console.log("Products indexed:", PRODUCTS.length);
    }
  } catch (err) {
    console.log("Catalog load error:", err.message);
  }
}

/* -----------------------------
VEHICLE + PART DETECTION
----------------------------- */

function detectVehicle(message) {
  const text = normalize(message);

  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : "";

  let make = "";
  let model = "";
  let part = "";

  const makes = ["toyota", "honda", "suzuki", "kia", "hyundai", "mg"];

  const models = [
    "corolla",
    "civic",
    "city",
    "alto",
    "mehran",
    "cultus"
  ];

  const parts = [
    "wiper",
    "air filter",
    "oil filter",
    "cabin filter",
    "spark plug",
    "brake pad",
    "car top cover",
    "sun shade",
    "floor mat"
  ];

  makes.forEach((m) => {
    if (text.includes(m)) make = m;
  });

  models.forEach((m) => {
    if (text.includes(m)) model = m;
  });

  parts.forEach((p) => {
    if (text.includes(p)) part = p;
  });

  return { make, model, year, part };
}

/* -----------------------------
SEARCH QUERY
----------------------------- */

function buildQuery(vehicle, message) {
  const q = `${vehicle.part || ""} ${vehicle.make || ""} ${
    vehicle.model || ""
  }`.trim();

  if (q.length > 2) return q;

  return normalize(message);
}

/* -----------------------------
SHOPIFY SEARCH LINK
----------------------------- */

function buildSearchURL(query) {
  return `https://www.ndestore.com/search?q=${encodeURIComponent(
    query
  )}&options%5Bprefix%5D=last`;
}

/* -----------------------------
WHATSAPP REPLY BUILDER
----------------------------- */

function buildReply(vehicle, query) {
  const url = buildSearchURL(query);

  return `Thank you for your inquiry.

Product: ${vehicle.part || "Automotive Part"}
Vehicle: ${vehicle.make || ""} ${vehicle.model || ""} ${vehicle.year || ""}

View options:
${url}

If you require further assistance please let us know.`;
}

/* -----------------------------
XML SAFE
----------------------------- */

function xmlSafe(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* -----------------------------
WHATSAPP WEBHOOK
----------------------------- */

app.post("/whatsapp", (req, res) => {
  const message = (req.body.Body || "").trim();

  const vehicle = detectVehicle(message);

  const query = buildQuery(vehicle, message);

  const reply = buildReply(vehicle, query);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${xmlSafe(reply)}</Message>
</Response>`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);
});

/* -----------------------------
SERVER START
----------------------------- */

app.listen(PORT, async () => {
  console.log("NDE AI Server running:", PORT);

  await loadProducts();
});
