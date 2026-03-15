import express from "express";
import twilio from "twilio";

import { processAIQuery } from "../services/ai_engine.js";
import { searchProducts, buildQuickReply } from "../services/quick_reply_engine.js";
import { storeMessage } from "../services/chat_memory.js";

const router = express.Router();

const MessagingResponse = twilio.twiml.MessagingResponse;

router.post("/webhook/whatsapp", async (req, res) => {

try {

const incomingMsg = req.body.Body || "";
const from = req.body.From || "";

storeMessage(from,"customer",incomingMsg);

let reply;

const products = searchProducts(incomingMsg);

if(products.length > 0){

reply = buildQuickReply(products);

}else{

reply = await processAIQuery(incomingMsg,from);

}

storeMessage(from,"ai",reply);

const twiml = new MessagingResponse();

twiml.message(reply);

res.writeHead(200, { "Content-Type": "text/xml" });

res.end(twiml.toString());

} catch (error) {

console.error("Webhook error:", error);

const twiml = new MessagingResponse();

twiml.message("System error. Please try again.");

res.writeHead(200, { "Content-Type": "text/xml" });

res.end(twiml.toString());

}

});

export default router;
