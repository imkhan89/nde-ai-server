import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {

  const message = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("Incoming WhatsApp message:", message);
  console.log("From:", sender);

  const reply = "Hello! NDE Automotive AI assistant is online. How can I help you today?";

  const twiml = `
<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${reply}</Message>
</Response>
`;

  res.set("Content-Type", "text/xml");
  res.status(200).send(twiml);

});

export default router;
