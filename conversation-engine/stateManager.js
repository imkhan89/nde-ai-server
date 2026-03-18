const stateDB = {};

function getState(user) {
  if (!stateDB[user]) {
    stateDB[user] = {
      step: 'menu',
      data: {},
      attempts: 0
    };
  }
  return stateDB[user];
}

function updateState(user, newState) {
  stateDB[user] = newState;
}

module.exports = { getState, updateState };
