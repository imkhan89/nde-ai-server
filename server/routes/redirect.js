const express = require('express');
const router = express.Router();

const { resolveShortLink } = require('../../database/shortLinks');

router.get('/:id', (req, res) => {
  try {
    const id = req.params.id;

    console.log('Redirect request for:', id);

    const originalUrl = resolveShortLink(id);

    if (!originalUrl) {
      return res.status(404).send('Link not found');
    }

    console.log('Redirecting to:', originalUrl);

    return res.redirect(originalUrl);

  } catch (error) {
    console.error('REDIRECT ERROR:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
