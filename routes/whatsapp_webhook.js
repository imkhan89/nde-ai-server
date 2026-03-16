import express from "express";

const router = express.Router();

router.post("/", (req, res) => {

  const message = req.body.Body;
  const from = req.body.From;

  console.log("Incoming WhatsApp message:", message);
  console.log("From:", from);

  const twiml = `
<Response>
<Message>
Hello! NDE Automotive AI assistant is online.
</Message>
</Response>
`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);
});

export default router;
