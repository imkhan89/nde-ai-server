import express from "express";

const router = express.Router();

router.get("/whatsapp", (req, res) => {

    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Verification request received");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully");
        return res.status(200).send(challenge);
    }

    console.log("Verification failed");
    return res.sendStatus(403);
});


router.post("/whatsapp", (req, res) => {

    console.log("Incoming webhook:", JSON.stringify(req.body, null, 2));

    res.sendStatus(200);

});

export default router;
