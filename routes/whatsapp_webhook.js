import express from "express";
import twilio from "twilio";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {

  try {

    const incomingMessage = req.body.Body || "";
    const sender = req.body.From || "";

    console.log("Incoming WhatsApp message:", incomingMessage);
    console.log("From:", sender);

    /*
    AI Response
    */

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an automotive assistant for ndestore.com helping customers find car parts."
        },
        {
          role: "user",
          content: incomingMessage
        }
      ]
    });

    const aiReply = completion.choices[0].message.content;

    /*
    Twilio response
    */

    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    twiml.message(aiReply);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());

  } catch (error) {

    console.error("Webhook error:", error);

    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    twiml.message("Sorry, the AI assistant is temporarily unavailable.");

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());

  }

});

export default router;
