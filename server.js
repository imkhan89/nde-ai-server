import express from "express";
import axios from "axios";
import OpenAI from "openai";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* OPENAI */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* SHOPIFY CONFIG */
const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("NDE AI SERVER RUNNING");
});

/* SHOPIFY PRODUCT SEARCH */
async function searchProduct(query) {

  try {

    const url =
      `https://${SHOP}/admin/api/2024-01/products.json?limit=50`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": TOKEN
      }
    });

    const products = response.data.products;

    const match = products.find(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );

    if (!match) return null;

    return {
      title: match.title,
      price: match.variants[0].price,
      handle: match.handle
    };

  } catch (err) {

    console.log("Shopify error:", err.message);
    return null;

  }

}

/* CUSTOMER SUPPORT RESPONSES */
function supportReplies(message) {

  message = message.toLowerCase();

  if (message.includes("delivery")) {
    return "Delivery takes 2–3 working days across Pakistan.";
  }

  if (message.includes("payment")) {
    return "We offer Cash on Delivery (COD) across Pakistan.";
  }

  if (message.includes("return")) {
    return "Returns are accepted within 7 days if the item is unused.";
  }

  if (message.includes("location")) {
    return "We deliver nationwide across Pakistan.";
  }

  return null;

}

/* WHATSAPP WEBHOOK */
app.post("/webhook", async (req, res) => {

  try {

    const incomingMsg = req.body.Body || "";
    const sender = req.body.From || "";

    console.log("Customer:", sender);
    console.log("Message:", incomingMsg);

    let reply = "";

    /* STEP 1: CHECK CUSTOMER SUPPORT QUESTIONS */
    const support = supportReplies(incomingMsg);

    if (support) {
      reply = support;
    }

    /* STEP 2: SEARCH PRODUCT */
    if (!reply) {

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

    /* STEP 3: AI RESPONSE */
    if (!reply) {

      const ai = await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
`You are a professional automotive parts sales assistant for ndestore.com.
Be short, helpful, and guide the customer to purchase.`
          },
          {
            role: "user",
            content: incomingMsg
          }
        ]

      });

      reply = ai.choices[0].message.content;

    }

    const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`;

    res.set("Content-Type", "text/xml");
    res.send(twiml);

  } catch (err) {

    console.log("Webhook error:", err);

    const twiml = `
<Response>
<Message>Sorry, something went wrong. Please try again.</Message>
</Response>
`;

    res.set("Content-Type", "text/xml");
    res.send(twiml);

  }

});

/* SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
