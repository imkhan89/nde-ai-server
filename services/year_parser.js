export function detectYear(message) {

  const match = message.match(/\b(19|20)\d{2}\b/)

  if (match) {
    return parseInt(match[0])
  }

  return null
}
