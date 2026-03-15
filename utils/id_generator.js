export function generateId(prefix = "") {
  const random = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);

  return `${prefix}${time}${random}`;
}

export function generateShortId() {
  return Math.random().toString(36).substring(2, 8);
}

export default {
  generateId,
  generateShortId
};
