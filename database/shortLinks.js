const shortDB = {};
let counter = 1;

function generateShortId() {
  return String(counter++).padStart(11, '0');
}

function getShortLink(originalUrl) {

  // check if already exists
  for (let key in shortDB) {
    if (shortDB[key] === originalUrl) {
      return key;
    }
  }

  // create new
  const id = generateShortId();
  shortDB[id] = originalUrl;

  return id;
}

function resolveShortLink(id) {
  return shortDB[id] || null;
}

module.exports = {
  getShortLink,
  resolveShortLink
};
