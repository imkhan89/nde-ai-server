const express = require('express');
const router = express.Router();

const { resolveShortLink } = require('../../database/shortLinks');

// Redirect short URL → original URL
router.get('/:id', (req, res) => {
  const id = req.params.id;

  const originalUrl = resolveShortLink(id);

  if (originalUrl) {
    return res.redirect(originalUrl);
  }

  return res.status(404).send('Link not found');
});

module.exports = router;
