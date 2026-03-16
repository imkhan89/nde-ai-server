import express from "express";

const router = express.Router();

router.post("/", (req, res) => {

  const incomingMessage = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("Incoming WhatsApp message:", incomingMessage);
  console.log("From:", sender);

  const reply = `
<Response>
<Message>
Hello! NDE Automotive AI assistant is online. How can I help you today?
</Message>
</Response>
`;

  res.set("Content-Type", "text/xml");
  res.send(reply);

});

export default router;
