require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const webhookRoute = require('./routes/webhook');
const redirectRoute = require('./routes/redirect');

const app = express();

app.use(bodyParser.json());

// WhatsApp Webhook
app.use('/webhook/whatsapp', webhookRoute);

// Short URL Redirect
app.use('/', redirectRoute);

// Health check
app.get('/', (req, res) => {
  res.send('Server Running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
