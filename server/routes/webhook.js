const express = require('express');
const router = express.Router();

const { handleMessage } = require('../../integrations/whatsapp');

router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

router.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      for (const entry of body.entry) {
        await handleMessage(entry);
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('WEBHOOK ERROR:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
