const { MessagingResponse } = require("twilio").twiml;


/* CENTRAL WEBHOOK HANDLER */

async function handleWebhook(req, res) {

  const twiml = new MessagingResponse();

  try {

    const incomingMessage = req.body.Body || "";
    const phone = req.body.From || "";

    console.log("Incoming message:", incomingMessage);

    const reply = await chatHandler.handleMessage(incomingMessage, phone);

    twiml.message(reply);

  } catch (err) {

    console.log("Webhook error:", err.message);

    twiml.message("System error. Please try again.");

  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());

}


/* SUPPORT BOTH ROUTES */

app.post("/webhook", handleWebhook);
app.post("/whatsapp", handleWebhook);
