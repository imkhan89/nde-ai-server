// conversation-engine/clarifier.js

function needsClarification(vehicle, parts) {
  // Missing critical vehicle info
  if (!vehicle.make || !vehicle.model) {
    return {
      type: "VEHICLE",
      message: "Please provide car make and model.\nExample: Suzuki Swift"
    };
  }

  // Missing year (optional but useful)
  if (!vehicle.year) {
    return {
      type: "YEAR",
      message: "Please specify model year.\nExample: 2021"
    };
  }

  // No part detected
  if (!parts || !parts.length) {
    return {
      type: "PART",
      message: "Which part do you need?\nExample: Brake Pads"
    };
  }

  // Ambiguous part (low confidence handled later)
  return null;
}

// Optional: part confidence clarification (future-ready)
function lowConfidenceHandler(partResult) {
  if (!partResult || partResult.confidence < 60) {
    return {
      type: "PART_CONFIRM",
      message: `Did you mean "${partResult.normalized_part.replace("_", " ")}"?`
    };
  }

  return null;
}

module.exports = {
  needsClarification,
  lowConfidenceHandler
};
