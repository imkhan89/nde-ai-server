const express = require('express');
const router = express.Router();

const { handleMessage } = require('../../integrations/whatsapp');

router.post('/', async (req, res) => {
  try {
    const message = req.body;
    await handleMessage(message);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
