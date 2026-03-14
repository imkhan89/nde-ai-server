const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running");
});

app.post("/webhook", (req, res) => {

  console.log("Webhook hit");
  console.log(req.body);

  const incomingMessage = req.body.Body || "";

  const twiml = new MessagingResponse();

  let reply = "";

  if (!incomingMessage) {
    reply =
      "Welcome to NDE Automotive AI.\n\nPlease share vehicle details:\nMake Model Year\n\nExample:\nToyota Corolla 2015";
  } else {
    reply =
      "Message received:\n" +
      incomingMessage +
      "\n\nPlease also include vehicle Make Model Year.";
  }

  twiml.message(reply);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
