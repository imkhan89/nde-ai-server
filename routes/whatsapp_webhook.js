import express from "express";
import twilio from "twilio";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {

  try {

    const incomingMessage = req.body.Body;
    const sender = req.body.From;

    console.log("Incoming WhatsApp message:", incomingMessage);
    console.log("From:", sender);

    /*
    -----------------------------
    Ask OpenAI for response
    -----------------------------
    */

    const aiResponse = await openai.chat.completions.create({
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

    const replyText = aiResponse.choices[0].message.content;

    /*
    -----------------------------
    Create Twilio response
    -----------------------------
    */

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(replyText);

    res.type("text/xml");
    res.send(twiml.toString());

  } catch (error) {

    console.error("Webhook error:", error);

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message("Sorry, something went wrong.");

    res.type("text/xml");
    res.send(twiml.toString());

  }

});

export default router;
