import express from "express";

const router = express.Router();

router.post("/whatsapp", (req, res) => {

    const incomingMessage = req.body.Body;
    const from = req.body.From;

    console.log("WhatsApp message received");
    console.log("From:", from);
    console.log("Message:", incomingMessage);

    const reply = `Hello 👋

You said: ${incomingMessage}

NDE Automotive AI is now working correctly.`;

    res.set("Content-Type", "text/xml");

    res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`);
});

export default router;
