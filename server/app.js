require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const webhookRoute = require('./routes/webhook');

const app = express();
app.use(bodyParser.json());

// ✅ FIX: Match Meta webhook path
app.use('/webhook/whatsapp', webhookRoute);

app.get('/', (req, res) => {
  res.send('Server Running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
