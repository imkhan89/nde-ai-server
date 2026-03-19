require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const { loadDatabase } = require("../fitmentService");
const webhook = require("../routes/webhook");

const app = express();

app.use(bodyParser.json());

app.use("/webhook", webhook);

app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 3000;

async function start() {
  await loadDatabase();

  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
}

start();
