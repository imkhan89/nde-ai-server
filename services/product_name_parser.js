export function detectProductName(message) {

  const parts = [
    "wiper blade",
    "wiper",
    "brake pad",
    "air filter",
    "oil filter",
    "cabin filter",
    "spark plug",
    "radiator",
    "coolant",
    "horn",
    "bumper",
    "bonnet",
    "fender"
  ]

  const msg = message.toLowerCase()

  for (const part of parts) {
    if (msg.includes(part)) {
      return part
    }
  }

  return null
}
