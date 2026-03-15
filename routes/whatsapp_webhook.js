import express from "express";
import generateAIReply from "../services/ai_service.js";

const router = express.Router();

router.post("/whatsapp", async (req, res) => {

  const message = req.body.Body || "";
  const sender = req.body.From || "";

  console.log("WhatsApp message received");
  console.log("From:", sender);
  console.log("Message:", message);

  const reply = await generateAIReply(message);

  res.set("Content-Type", "text/xml");

  res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`);

});

export default router;
