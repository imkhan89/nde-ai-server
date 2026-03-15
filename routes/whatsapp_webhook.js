import express from "express";
import generateAIReply from "../services/ai_service.js";

const router = express.Router();

router.post("/whatsapp", async (req, res) => {

  const message = req.body.Body || "";
  const from = req.body.From || "";

  console.log("WhatsApp message received");
  console.log("From:", from);
  console.log("Message:", message);

  const aiReply = await generateAIReply(message);

  res.set("Content-Type", "text/xml");

  res.send(`
<Response>
<Message>${aiReply}</Message>
</Response>
`);
});

export default router;
