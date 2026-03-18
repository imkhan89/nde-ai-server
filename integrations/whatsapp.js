const axios = require('axios');

const { parseMessage } = require('../ai-engine/parser');
const { decideResponse } = require('../ai-engine/decision');
const { getState, updateState } = require('../conversation-engine/stateManager');

async function sendWhatsAppMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

async function handleMessage(entry) {
  try {
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || !messages[0]) return;

    const msg = messages[0];

    const user = msg.from;
    const text = msg.text?.body || '';

    console.log('Incoming:', text);

    let state = getState(user);

    const parsed = parseMessage(text);
    const result = decideResponse(parsed, state);

    updateState(user, result.newState);

    console.log('Reply:', result.text);

    await sendWhatsAppMessage(user, result.text);

  } catch (error) {
    console.error('WHATSAPP ERROR:', error.response?.data || error.message);
  }
}

module.exports = { handleMessage };
