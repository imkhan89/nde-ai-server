import express from "express";
import axios from "axios";
import OpenAI from "openai";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* Health check */
app.get("/", (req, res) => {
  res.send("NDE AI SERVER RUNNING");
});

/* Shopify product search */
async function searchProduct(query) {

  const shop = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;

  const url = `https://${shop}/admin/api/2024-01/products.json?limit=5`;

  const response = await axios.get(url, {
    headers: {
      "X-Shopify-Access-Token": token
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
}

/* WhatsApp webhook */
app.post("/webhook", async (req, res) => {

  const incomingMsg = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("Message:", incomingMsg);

  let reply = "";

  /* AI understanding */
  const ai = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an automotive parts sales assistant for ndestore.com"
      },
      {
        role: "user",
        content: incomingMsg
      }
    ]
  });

  const aiResponse = ai.choices[0].message.content;

  /* Try to find product */
  const product = await searchProduct(incomingMsg);

  if (product) {

    reply =
`Yes, we have this available.

${product.title}
Price: PKR ${product.price}

Order here:
https://ndestore.com/products/${product.handle}`;

  } else {

    reply = aiResponse;
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
  console.log("Server running on port " + PORT);
});
