// conversation-engine/clarifier.js

function needsClarification(vehicle, parts) {
  if (!vehicle.make || !vehicle.model) {
    return {
      type: "VEHICLE",
      message: "Please provide car make and model.\nExample: Suzuki Swift"
    };
  }

  if (!vehicle.year) {
    return {
      type: "YEAR",
      message: "Please specify model year.\nExample: 2021"
    };
  }

  if (!parts || !parts.length) {
    return {
      type: "PART",
      message: "Which part do you need?\nExample: Brake Pads"
    };
  }

  return null;
}

// ✅ NEW: PART CONFIRMATION
function confirmPartIfNeeded(partResult) {
  if (!partResult) return null;

  if (partResult.confidence < 70) {
    return {
      type: "PART_CONFIRM",
      message: `Did you mean "${partResult.normalized_part.replace("_", " ")}"?\nReply YES or NO`
    };
  }

  return null;
}

module.exports = {
  needsClarification,
  confirmPartIfNeeded
};
