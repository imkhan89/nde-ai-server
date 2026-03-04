import express from "express";
import axios from "axios";
import OpenAI from "openai";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

app.get("/", (req, res) => {
  res.send("NDE AI SERVER RUNNING");
});

/* PRODUCT SEARCH */
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

/* WEBHOOK */
app.post("/webhook", async (req, res) => {

  const incomingMsg = req.body.Body || "";

  console.log("Message:", incomingMsg);

  let reply = "Please send car model and required part.";

  try {

    const product = await searchProduct(incomingMsg);

    if (product) {

      reply =
`Yes, we have this available.

${product.title}

Price: PKR ${product.price}

Order here:
https://ndestore.com/products/${product.handle}`;

    } else {

      const ai = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: incomingMsg }
        ]
      });

      reply = ai.choices[0].message.content;

    }

  } catch (err) {

    console.log("Webhook error:", err.message);

  }

  const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
