const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MessagingResponse = twilio.twiml.MessagingResponse;


// Root test route
app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running");
});


// WHATSAPP WEBHOOK
app.post("/whatsapp", async (req, res) => {

  console.log("WhatsApp webhook triggered");
  console.log(req.body);

  const incoming = (req.body.Body || "").toLowerCase().trim();

  let reply = "";

  if (!incoming) {
    reply = "Please send a message.";
  }

  else if (incoming.includes("wiper")) {
    reply =
`Please share your vehicle details.

Example:
Suzuki Swift 2021
Toyota Corolla 2018`;
  }

  else if (incoming.includes("hello") || incoming.includes("hi")) {
    reply =
`Welcome to ndestore.com

Send request in this format:

Part + Make + Model + Year

Example:
Wiper Blade Suzuki Swift 2021`;
  }

  else {
    reply =
`Send request in this format:

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
