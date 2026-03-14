export function detectVehicle(message) {

  const msg = message.toLowerCase()

  const vehicles = [
    "corolla",
    "civic",
    "city",
    "hilux",
    "prado",
    "vigo",
    "revo",
    "fortuner",
    "yaris",
    "mehran",
    "cultus",
    "alto",
    "wagon r",
    "swift"
  ]

  for (let i = 0; i < vehicles.length; i++) {
    if (msg.includes(vehicles[i])) {
      return vehicles[i]
    }
  }

  return null
}
