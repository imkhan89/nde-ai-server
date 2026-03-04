import express from "express";
import axios from "axios";
import OpenAI from "openai";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* ============================= */
/* SAFE ENVIRONMENT VARIABLES */
/* ============================= */

const OPENAI_KEY = process.env.OPENAI_API_KEY || null;
const SHOP = process.env.SHOPIFY_STORE_DOMAIN || "";
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

/* ============================= */
/* SAFE OPENAI INITIALIZATION */
/* ============================= */

let openai = null;

if (OPENAI_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_KEY });
  console.log("OpenAI initialized");
} else {
  console.log("WARNING: OPENAI_API_KEY missing");
}

/* ============================= */
/* HEALTH CHECK */
/* ============================= */

app.get("/", (req, res) => {
  res.send("NDE AI SERVER RUNNING");
});

/* ============================= */
/* SHOPIFY PRODUCT SEARCH */
/* ============================= */

async function searchProduct(query) {

  if (!SHOP || !TOKEN) {
    console.log("Shopify credentials missing");
    return null;
  }

  try {

    const url =
      `https://${SHOP}/admin/api/2024-01/products.json?limit=50`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": TOKEN
      }
    });

    const products = response.data.products || [];

    const match = products.find(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
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
/* BASIC CUSTOMER SUPPORT */
/* ============================= */

function supportReplies(message) {

  const msg = message.toLowerCase();

  if (msg.includes("delivery"))
    return "Delivery takes 2–3 working days across Pakistan.";

  if (msg.includes("payment"))
    return "We offer Cash on Delivery (COD) across Pakistan.";

  if (msg.includes("return"))
    return "Returns are accepted within 7 days if unused.";

  if (msg.includes("location"))
    return "We deliver nationwide across Pakistan.";

  return null;

}

/* ============================= */
/* WHATSAPP WEBHOOK */
/* ============================= */

app.post("/webhook", async (req, res) => {

  const incomingMsg = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("Customer:", sender);
  console.log("Message:", incomingMsg);

  let reply = "Please share your car model and required part.";

  try {

    /* STEP 1 — SUPPORT QUESTIONS */

    const support = supportReplies(incomingMsg);

    if (support) {
      reply = support;
    }

    /* STEP 2 — PRODUCT SEARCH */

    if (!support) {

      const product = await searchProduct(incomingMsg);

      if (product) {

        reply =
`Yes, we have this available.

${product.title}

Price: PKR ${product.price}

Order here:
https://ndestore.com/products/${product.handle}`;

      }

    }

    /* STEP 3 — AI RESPONSE */

    if (!support && reply === "Please share your car model and required part.") {

      if (openai) {

        try {

          const ai = await openai.chat.completions.create({

            model: "gpt-4o-mini",

            messages: [
              {
                role: "system",
                content:
"You are a professional automotive parts sales assistant for ndestore.com."
              },
              {
                role: "user",
                content: incomingMsg
              }
            ],

            max_tokens: 120

          });

          reply = ai.choices?.[0]?.message?.content || reply;

        } catch (err) {

          console.log("OpenAI error:", err.message);

        }

      }

    }

  } catch (err) {

    console.log("Webhook error:", err.message);

  }

  /* ============================= */
  /* ALWAYS RETURN TWILIO RESPONSE */
  /* ============================= */

  const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);

});

/* ============================= */
/* START SERVER */
/* ============================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
