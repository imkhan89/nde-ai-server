const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MessagingResponse = twilio.twiml.MessagingResponse;



// Root check
app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running");
});



// WhatsApp webhook
app.post("/whatsapp", (req, res) => {

  console.log("Incoming WhatsApp message:");
  console.log(req.body);

  const msg = (req.body.Body || "").toLowerCase();

  let reply = "";

  if (msg.includes("hi") || msg.includes("hello")) {
    reply = `Welcome to ndestore.com

Send request in this format:

Part + Make + Model + Year

Example:
Wiper Blade Suzuki Swift 2021`;
  }

  else if (msg.includes("wiper")) {
    reply = `Please share your vehicle details.

Example:
Suzuki Swift 2021
Toyota Corolla 2018`;
  }

  else {
    reply = `Send request in this format:

Part + Make + Model + Year

Example:
Brake Pad Toyota Corolla 2018`;
  }

  const twiml = new MessagingResponse();
  twiml.message(reply);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());

});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
