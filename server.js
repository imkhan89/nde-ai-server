const express = require("express");
const bodyParser = require("body-parser");
const conversationEngine = require("./conversation_engine");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* =========================
HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.send("Automotive AI Engine Running");
});

/* =========================
WHATSAPP WEBHOOK
========================= */

app.post("/whatsapp", (req, res) => {

let incomingMessage = "";

try {

incomingMessage =
req.body?.Body ||
req.body?.message ||
req.body?.text ||
"";

} catch(error){

console.error("Incoming message error:",error);

}

let response = null;

try {

response = conversationEngine(incomingMessage);

} catch(error){

console.error("Conversation engine error:",error);

response = {
reply:"System processing error. Please try again."
};

}

const reply = response?.reply || "Please send vehicle and part details.";

/* =========================
RESPONSE
========================= */

res.json({
reply: reply,
vehicle: response?.vehicle || null,
part: response?.part || null,
year: response?.year || null
});

});

/* =========================
SERVER START
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server running on port", PORT);
});
