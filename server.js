app.post("/webhook", async (req, res) => {

  const incomingMsg = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("Customer:", sender);
  console.log("Message:", incomingMsg);

  let reply = "";

  try {

    /* STEP 1: SUPPORT */
    const support = supportReplies(incomingMsg);
    if (support) {
      reply = support;
    }

    /* STEP 2: PRODUCT SEARCH */
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

      try {

        const ai = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
"You are an automotive parts assistant for ndestore.com."
            },
            {
              role: "user",
              content: incomingMsg
            }
          ],
          max_tokens: 120
        });

        reply = ai.choices[0].message.content;

      } catch (err) {

        console.log("OpenAI error:", err.message);

        reply =
"Please share your car model, year, and required part so we can assist you.";

      }

    }

  } catch (err) {

    console.log("Webhook error:", err.message);

    reply =
"Sorry, we could not process your request. Please try again.";

  }

  const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);

});
