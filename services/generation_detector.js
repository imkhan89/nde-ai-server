import { vehicleGenerationRanges } from "../data/vehicle_generation_ranges.js"

export function detectGeneration(model, year) {

  if (!model || !year) {
    return null
  }

  const ranges = vehicleGenerationRanges[model]

  if (!ranges) {
    return null
  }

  for (const range of ranges) {

    if (year >= range.start && year <= range.end) {

      return {
        generationStart: range.start,
        generationEnd: range.end
      }

    }

  }

  return null
}
