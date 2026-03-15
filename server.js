import express from "express";
import dotenv from "dotenv";
import whatsappWebhook from "./routes/whatsapp_webhook.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/webhook", whatsappWebhook);

app.get("/", (req, res) => {
    res.send("NDE Automotive AI Server Running");
});

app.listen(PORT, () => {
    console.log(`ndestore.com Automotive AI running on port ${PORT}`);
});
