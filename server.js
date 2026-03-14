const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;

const app = express();

// Twilio sends data as URL encoded
app.use(bodyParser.urlencoded({ extended: false }));

// Health check
app.get("/", (req, res) => {
  res.send("NDE Automotive AI Server Running");
});

// WhatsApp webhook
app.post("/webhook", async (req, res) => {
  try {
    const incomingMsg = req.body.Body || "";
    const from = req.body.From || "";

    console.log("Incoming message:", incomingMsg);
    console.log("From:", from);

    const twiml = new MessagingResponse();

    // Simple response logic
    if (!incomingMsg || incomingMsg.trim() === "") {
      twiml.message(
        "Welcome to NDE Automotive AI.\n\nPlease share your vehicle details:\nMake Model Year\n\nExample:\nToyota Corolla 2015"
      );
    } else {
      twiml.message(
        "NDE Automotive AI received your message:\n\n" +
          incomingMsg +
          "\n\nPlease also share vehicle details if missing.\nExample:\nHonda Civic 2018"
      );
    }

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());

  } catch (error) {
    console.error("Webhook Error:", error);

    const twiml = new MessagingResponse();
    twiml.message(
      "Sorry, something went wrong. Please try again or send your vehicle details.\nExample: Toyota Corolla 2015"
    );

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
