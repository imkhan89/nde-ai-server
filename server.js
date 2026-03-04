import express from "express";
import twilio from "twilio";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NDE AI SERVER RUNNING");
});

app.post("/webhook", (req, res) => {

  const incomingMsg = req.body.Body;

  console.log("Incoming message:", incomingMsg);

  const MessagingResponse = twilio.twiml.MessagingResponse;
  const twiml = new MessagingResponse();

  twiml.message("Hello from NDE AI Assistant");

  res.type("text/xml");
  res.send(twiml.toString());

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
