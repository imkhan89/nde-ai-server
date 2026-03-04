import express from "express";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NDE AI SERVER RUNNING");
});

app.post("/webhook", (req, res) => {

  const incomingMsg = req.body.Body;

  console.log("Incoming message:", incomingMsg);

  const twiml = `
<Response>
<Message>Hello from NDE AI Assistant</Message>
</Response>
`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
