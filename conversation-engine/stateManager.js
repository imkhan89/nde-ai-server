// conversation-engine/stateManager.js

const sessions = {};

// -----------------------------
// GET SESSION
// -----------------------------
function getSession(userId) {
  if (!sessions[userId]) {
    sessions[userId] = {
      vehicle: {
        make: null,
        model: null,
        year: null
      },
      awaitingVehicle: false,
      lastUpdated: Date.now()
    };
  }
  return sessions[userId];
}

// -----------------------------
// UPDATE VEHICLE (SMART MERGE)
// -----------------------------
function updateVehicle(userId, newVehicle) {
  const session = getSession(userId);

  if (newVehicle.make) session.vehicle.make = newVehicle.make;
  if (newVehicle.model) session.vehicle.model = newVehicle.model;
  if (newVehicle.year) session.vehicle.year = newVehicle.year;

  session.lastUpdated = Date.now();

  return session;
}

// -----------------------------
// HAS VEHICLE
// -----------------------------
function hasVehicle(userId) {
  const session = getSession(userId);
  return session.vehicle.make && session.vehicle.model;
}

// -----------------------------
// CLEAR SESSION
// -----------------------------
function clearSession(userId) {
  delete sessions[userId];
}

// -----------------------------
// GET VEHICLE SUMMARY
// -----------------------------
function getVehicleSummary(vehicle) {
  return `${vehicle.make?.toUpperCase()} ${vehicle.model?.toUpperCase()} ${vehicle.year || ""}`.trim();
}

module.exports = {
  getSession,
  updateVehicle,
  hasVehicle,
  clearSession,
  getVehicleSummary
};
