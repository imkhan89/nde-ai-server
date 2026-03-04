import express from "express";

const app = express();

/* Parse Twilio request body */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Health check route */
app.get("/", (req, res) => {
  res.send("NDE AI SERVER RUNNING");
});

/* WhatsApp webhook */
app.post("/webhook", (req, res) => {

  const incomingMsg = req.body.Body || "";
  const sender = req.body.From || "Unknown";

  console.log("Sender:", sender);
  console.log("Message:", incomingMsg);

  let reply = "Hello from NDE AI Assistant";

  /* Example rule-based response */
  if (incomingMsg.toLowerCase().includes("hello")) {
    reply = "Hello! How can I help you today?";
  }

  const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);

});

/* Start server */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
