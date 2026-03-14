export function detectMake(model) {

  const makes = {
    Toyota: [
      "corolla",
      "yaris",
      "hilux",
      "vigo",
      "revo",
      "fortuner",
      "prado"
    ],

    Honda: [
      "civic",
      "city"
    ],

    Suzuki: [
      "mehran",
      "alto",
      "cultus",
      "wagon r",
      "swift"
    ]
  }

  for (const make in makes) {
    if (makes[make].includes(model)) {
      return make
    }
  }

  return null
}
