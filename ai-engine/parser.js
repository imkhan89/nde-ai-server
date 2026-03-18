function parseMessage(text) {
  if (!text) return { intent: 'unknown' };

  const clean = text.toLowerCase().trim();

  if (['1','2','3','4','5','6','#'].includes(clean)) {
    return { intent: 'menu', value: clean };
  }

  const multiParts = clean.split(/,|and|\+/);

  return {
    intent: 'text',
    raw: clean,
    parts: multiParts.map(p => p.trim())
  };
}

module.exports = { parseMessage };
