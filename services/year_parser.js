function detectYear(message) {

  const yearMatch = message.match(/\b(19|20)\d{2}\b/);

  if (yearMatch) {
    return parseInt(yearMatch[0]);
  }

  return null;
}

module.exports = {
  detectYear
};
