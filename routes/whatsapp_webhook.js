import express from "express";

const router = express.Router();

/* Twilio webhook endpoint */
router.post("/whatsapp", (req, res) => {

  const incomingMessage = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("WhatsApp message received");
  console.log("Sender:", sender);
  console.log("Message:", incomingMessage);

  const replyMessage =
`Hello 👋

You said: ${incomingMessage}

NDE Automotive AI is now connected successfully.`;


  res.set("Content-Type", "text/xml");

  res.send(`
<Response>
<Message>${replyMessage}</Message>
</Response>
`);
});

export default router;
