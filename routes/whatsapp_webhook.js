import express from "express";
import twilio from "twilio";

const router = express.Router();

router.post("/", (req, res) => {

  const incomingMessage = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("Incoming WhatsApp message:", incomingMessage);
  console.log("From:", sender);

  const MessagingResponse = twilio.twiml.MessagingResponse;
  const response = new MessagingResponse();

  response.message(
    "Hello! NDE Automotive AI assistant is online. How can I help you today?"
  );

  res.type("text/xml");
  res.send(response.toString());
});

export default router;
