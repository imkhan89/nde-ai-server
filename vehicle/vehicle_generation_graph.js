const VEHICLE_GENERATIONS = {
  toyota: {
    corolla: [
      { generation: "E140", start: 2007, end: 2013 },
      { generation: "E170", start: 2014, end: 2020 },
      { generation: "E210", start: 2021, end: 2030 }
    ],
    yaris: [
      { generation: "XP90", start: 2005, end: 2011 },
      { generation: "XP130", start: 2012, end: 2019 },
      { generation: "XP210", start: 2020, end: 2030 }
    ]
  },

  honda: {
    civic: [
      { generation: "8th", start: 2006, end: 2011 },
      { generation: "9th", start: 2012, end: 2015 },
      { generation: "10th", start: 2016, end: 2021 },
      { generation: "11th", start: 2022, end: 2030 }
    ],

    city: [
      { generation: "GM2", start: 2009, end: 2013 },
      { generation: "GM6", start: 2014, end: 2020 },
      { generation: "GN", start: 2021, end: 2030 }
    ]
  },

  suzuki: {
    alto: [
      { generation: "HA36", start: 2014, end: 2023 },
      { generation: "HA37", start: 2024, end: 2030 }
    ],

    cultus: [
      { generation: "Gen2", start: 2000, end: 2016 },
      { generation: "Gen3", start: 2017, end: 2030 }
    ]
  }
};

export function getVehicleGeneration(make, model, year) {
  if (!make || !model || !year) return null;

  const makeData = VEHICLE_GENERATIONS[make];
  if (!makeData) return null;

  const modelData = makeData[model];
  if (!modelData) return null;

  for (const gen of modelData) {
    if (year >= gen.start && year <= gen.end) {
      return gen.generation;
    }
  }

  return null;
}

export function getAllGenerations(make, model) {
  if (!VEHICLE_GENERATIONS[make]) return [];

  return VEHICLE_GENERATIONS[make][model] || [];
}

export default {
  getVehicleGeneration,
  getAllGenerations
};
