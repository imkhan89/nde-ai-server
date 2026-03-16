import express from "express";
import twilio from "twilio";

const router = express.Router();

router.post("/", async (req, res) => {

  const incomingMessage = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("Incoming WhatsApp message:", incomingMessage);
  console.log("From:", sender);

  const MessagingResponse = twilio.twiml.MessagingResponse;
  const twiml = new MessagingResponse();

  twiml.message(
    "Hello! NDE Automotive AI assistant is online. How can I help you today?"
  );

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());

});

export default router;
