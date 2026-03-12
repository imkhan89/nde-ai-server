const express = require("express");
const bodyParser = require("body-parser");
const conversationEngine = require("./conversation_engine");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Automotive AI Engine Running");
});


app.post("/whatsapp", (req, res) => {

  const incomingMessage =
    req.body.Body ||
    req.body.message ||
    req.body.text ||
    "";

  const response = conversationEngine(incomingMessage);

  const reply = response?.reply || "Please send vehicle and part details.";

  res.json({
    reply: reply,
    vehicle: response?.vehicle || null,
    part: response?.part || null,
    year: response?.year || null
  });

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
