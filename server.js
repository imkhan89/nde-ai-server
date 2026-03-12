const express = require("express");
const bodyParser = require("body-parser");
const conversationEngine = require("./conversation_engine");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ndestore WhatsApp AI running");
});

app.post("/whatsapp", async (req, res) => {

let message = "";
let from = "";

try {

message = req.body.Body || "";
from = req.body.From || "";

console.log("Incoming message:", message);

} catch (error) {

console.error("Incoming parsing error:", error);

}

let reply = "";

try {

const result = await conversationEngine(message, from);

reply = result.reply;

} catch (error) {

console.error("Conversation engine error:", error);

reply = "System is temporarily unavailable. Please try again.";

}

res.set("Content-Type", "text/xml");

res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server running on port", PORT);
});
