export function detectPart(message) {

  const msg = message.toLowerCase()

  const parts = [
    "wiper",
    "wiper blade",
    "brake pad",
    "brake pads",
    "air filter",
    "oil filter",
    "cabin filter",
    "spark plug",
    "radiator",
    "coolant",
    "horn",
    "bumper",
    "bonnet",
    "fender",
    "radiator cap"
  ]

  for (let i = 0; i < parts.length; i++) {
    if (msg.includes(parts[i])) {
      return parts[i]
    }
  }

  return null
}
