import express from "express";

const router = express.Router();

router.post("/webhook/whatsapp", (req, res) => {

    const incomingMsg = req.body.Body;
    const from = req.body.From;

    console.log("WhatsApp message received");
    console.log("From:", from);
    console.log("Message:", incomingMsg);

    const reply = `Hello 👋\n\nYou said: ${incomingMsg}\n\nNDE Automotive AI is working correctly.`;

    res.set("Content-Type", "text/xml");

    res.send(`
        <Response>
            <Message>${reply}</Message>
        </Response>
    `);
});

export default router;
