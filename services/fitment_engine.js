export function getFitment(vehicle, year, part) {

  const fitmentData = {

    corolla: [
      {
        start: 2014,
        end: 2019,
        wiper: {
          driver: "26",
          passenger: "14"
        }
      }
    ],

    civic: [
      {
        start: 2016,
        end: 2021,
        wiper: {
          driver: "26",
          passenger: "18"
        }
      }
    ],

    hilux: [
      {
        start: 2015,
        end: 2022,
        wiper: {
          driver: "22",
          passenger: "22"
        }
      }
    ]

  }

  if (!vehicle || !year) return null

  const vehicleData = fitmentData[vehicle]

  if (!vehicleData) return null

  for (const generation of vehicleData) {

    if (year >= generation.start && year <= generation.end) {

      if (generation[part]) {
        return generation[part]
      }

    }

  }

  return null
}
