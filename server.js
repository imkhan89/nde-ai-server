import express from "express";
import axios from "axios";
import OpenAI from "openai";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* ============================= */
/* ENV VARIABLES */
/* ============================= */

const OPENAI_KEY = process.env.OPENAI_API_KEY || null;
const SHOP = process.env.SHOPIFY_STORE_DOMAIN || "";
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

let openai = null;

if (OPENAI_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_KEY });
  console.log("OpenAI initialized");
} else {
  console.log("WARNING: OPENAI_API_KEY missing");
}

/* ============================= */
/* XML SAFE FUNCTION */
/* ============================= */

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ============================= */
/* HEALTH CHECK */
/* ============================= */

app.get("/", (req, res) => {
  res.send("API SERVER RUNNING");
});

/* ============================= */
/* BASIC SUPPORT RESPONSES */
/* ============================= */

function supportReplies(msg) {

  const m = msg.toLowerCase();

  if (m.includes("delivery"))
    return "Delivery takes 2–3 working days across Pakistan.";

  if (m.includes("payment"))
    return "We offer Cash on Delivery (COD) across Pakistan.";

  if (m.includes("return"))
    return "Returns are accepted within 7 days if unused.";

  if (m.includes("location"))
    return "We deliver nationwide across Pakistan.";

  return null;

}

/* ============================= */
/* VEHICLE DETECTION AI */
/* ============================= */

async function detectVehicle(message) {

  if (!openai) return null;

  try {

    const ai = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: `
Extract vehicle and part from the message.

Return JSON only:

{
 "brand":"",
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

    });

    const content = ai.choices[0].message.content;

    return JSON.parse(content);

  } catch (err) {

    console.log("Vehicle detection error:", err.message);
    return null;

  }

}

/* ============================= */
/* SHOPIFY SMART SEARCH */
/* ============================= */

async function searchShopify(query) {

  if (!SHOP || !TOKEN) return null;

  try {

    const url =
`https://${SHOP}/admin/api/2024-01/products.json?limit=100`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": TOKEN
      },
      timeout: 5000
    });

    const products = response.data.products || [];

    const q = query.toLowerCase();

    const match = products.find(p =>
      p.title.toLowerCase().includes(q) ||
      q.includes(p.title.toLowerCase())
    );

    if (!match) return null;

    return {
      title: match.title,
      price: match.variants?.[0]?.price || "N/A",
      handle: match.handle
    };

  } catch (err) {

    console.log("Shopify error:", err.message);
    return null;

  }

}

/* ============================= */
/* AI SALES RESPONSE */
/* ============================= */

async function salesAI(message) {

  if (!openai) return null;

  try {

    const ai = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [

        {
          role: "system",
          content: `
You are a professional automotive sales assistant for ndestore.com.

Rules:
- Only recommend products from ndestore.com
- Never mention Amazon, eBay, AutoZone or other stores
- Keep replies short
- Focus on helping customer buy
- Ask for vehicle model/year if needed
`
        },

        {
          role: "user",
          content: message
        }

      ],

      max_tokens: 120

    });

    return ai.choices[0].message.content;

  } catch (err) {

    console.log("AI error:", err.message);
    return null;

  }

}

/* ============================= */
/* WHATSAPP WEBHOOK */
/* ============================= */

app.post("/webhook", async (req, res) => {

  console.log("Webhook triggered");

  const incomingMsg = req.body.Body || "";
  const sender = req.body.From || "";

  console.log(sender, incomingMsg);

  let reply = "Please share your car model and required part.";

  try {

    /* SUPPORT */

    const support = supportReplies(incomingMsg);

    if (support) {
      reply = support;
    }

    /* VEHICLE DETECTION */

    if (!support) {

      const vehicle = await detectVehicle(incomingMsg);

      if (vehicle) {

        const searchQuery =
`${vehicle.brand} ${vehicle.model} ${vehicle.part}`;

        const product = await searchShopify(searchQuery);

        if (product) {

          reply =
`Yes, we have this available.

${product.title}

Price: PKR ${product.price}

Order here:
https://ndestore.com/products/${product.handle}`;

        } else {

          reply =
`Please confirm the model year of your ${vehicle.model} so I can recommend the correct ${vehicle.part}.`;

        }

      }

    }

    /* AI FALLBACK */

    if (reply === "Please share your car model and required part.") {

      const aiReply = await salesAI(incomingMsg);

      if (aiReply) reply = aiReply;

    }

  } catch (err) {

    console.log("Webhook error:", err.message);

  }

  const twiml =
`<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${escapeXml(reply)}</Message>
</Response>`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);

});

/* ============================= */
/* SERVER START */
/* ============================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
