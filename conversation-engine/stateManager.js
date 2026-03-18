// conversation-engine/stateManager.js

const sessions = {};

// -----------------------------
// 🧠 GET SESSION
// -----------------------------
function getSession(userId) {
  if (!sessions[userId]) {
    sessions[userId] = {
      vehicle: {
        make: null,
        model: null,
        year: null
      },
      lastUpdated: Date.now()
    };
  }

  return sessions[userId];
}

// -----------------------------
// 💾 UPDATE VEHICLE
// -----------------------------
function updateVehicle(userId, vehicle) {
  const session = getSession(userId);

  if (vehicle.make) session.vehicle.make = vehicle.make;
  if (vehicle.model) session.vehicle.model = vehicle.model;
  if (vehicle.year) session.vehicle.year = vehicle.year;

  session.lastUpdated = Date.now();

  return session;
}

// -----------------------------
// ♻️ CLEAR SESSION
// -----------------------------
function clearSession(userId) {
  delete sessions[userId];
}

// -----------------------------
// ⏳ CLEANUP (optional)
// -----------------------------
function cleanupSessions(timeout = 30 * 60 * 1000) {
  const now = Date.now();

  Object.keys(sessions).forEach(userId => {
    if (now - sessions[userId].lastUpdated > timeout) {
      delete sessions[userId];
    }
  });
}

module.exports = {
  getSession,
  updateVehicle,
  clearSession,
  cleanupSessions
};
