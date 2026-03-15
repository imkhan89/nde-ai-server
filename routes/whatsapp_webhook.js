import express from "express";
import twilio from "twilio";
import { processAIQuery } from "../services/ai_engine.js";

const router = express.Router();

const MessagingResponse = twilio.twiml.MessagingResponse;

router.post("/webhook/whatsapp", async (req, res) => {
  try {
    const incomingMsg = req.body.Body || "";
    const from = req.body.From || "";

    const aiReply = await processAIQuery(incomingMsg, from);

    const twiml = new MessagingResponse();
    twiml.message(aiReply);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (error) {
    console.error("WhatsApp webhook error:", error);

    const twiml = new MessagingResponse();
    twiml.message(
      "Thank you for contacting ndestore.com. Our system is temporarily unavailable. Please try again shortly."
    );

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
});

router.post("/whatsapp", async (req, res) => {
  try {
    const incomingMsg = req.body.Body || "";
    const from = req.body.From || "";

    const aiReply = await processAIQuery(incomingMsg, from);

    const twiml = new MessagingResponse();
    twiml.message(aiReply);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (error) {
    console.error("WhatsApp route error:", error);

    const twiml = new MessagingResponse();
    twiml.message(
      "Thank you for contacting ndestore.com. Please try again shortly."
    );

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
});

export default router;
