// server.js

import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { initDatabase } from "./database/database.js";
import { syncShopifyProducts } from "./sync/shopify_sync.js";
import { processCustomerMessage } from "./services/ai_engine.js";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db;

// Initialize system
async function initialize() {

    try {

        db = await initDatabase();

        console.log("Database connected");

        await syncShopifyProducts(db);

        console.log("Initial Shopify product sync completed");

        // Scheduled sync every 6 hours
        setInterval(async () => {

            console.log("Running scheduled Shopify sync");

            await syncShopifyProducts(db);

        }, 6 * 60 * 60 * 1000);

    } catch (error) {

        console.error("Initialization error:", error);

    }

}

initialize();


// Health check route
app.get("/", (req, res) => {

    res.send("NDE Automotive AI Server Running");

});


// WhatsApp webhook
app.post("/whatsapp", async (req, res) => {

    try {

        const incomingMessage = req.body.Body || "";
        const sessionId = req.body.From || "anonymous";

        console.log("Incoming WhatsApp message:", incomingMessage);

        const reply = await processCustomerMessage(db, sessionId, incomingMessage);

        const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`;

        res.set("Content-Type", "text/xml");
        res.send(twiml);

    } catch (error) {

        console.error("Webhook error:", error);

        res.set("Content-Type", "text/xml");

        res.send(`
<Response>
<Message>Sorry, something went wrong. Please try again.</Message>
</Response>
`);

    }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`NDE Automotive AI Server running on port ${PORT}`);

});
