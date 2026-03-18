function mainMenu() {
  return `Welcome to ndestore.com AI Support

1 Auto Parts
2 Car Accessories
3 Sticker Decals
4 Order Status
5 Chat Support
6 Complaints

Reply with 1-6 to continue.`;
}

function autoPartsPrompt() {
  return `Auto Parts Inquiry

Share details:
Part Name
Make
Model
Year

Example:
Air Filter Suzuki Swift 2021`;
}

function decideResponse(parsed, state) {

  if (parsed.intent === 'menu' && parsed.value === '#') {
    return {
      text: mainMenu(),
      newState: { step: 'menu', data: {}, attempts: 0 }
    };
  }

  if (state.step === 'menu' && parsed.intent !== 'menu') {
    return {
      text: mainMenu(),
      newState: { step: 'menu', data: {}, attempts: 0 }
    };
  }

  if (parsed.intent === 'menu') {

    if (parsed.value === '1') {
      return {
        text: autoPartsPrompt(),
        newState: { step: 'auto_parts', data: {}, attempts: 0 }
      };
    }

    return {
      text: 'Module under development',
      newState: state
    };
  }

  if (state.step === 'auto_parts') {

    if (!parsed.parts || parsed.parts.length === 0) {
      return errorResponse(state);
    }

    if (parsed.parts.length > 1) {
      return {
        text: `Kindly share all required parts with vehicle details.

Example:
Air Filter, Brake Pads
Suzuki
Swift
2021`,
        newState: { ...state, attempts: 0 }
      };
    }

    return {
      text: `Processing your request...

(Next phase: product mapping)`,
      newState: { ...state, attempts: 0 }
    };
  }

  return errorResponse(state);
}

function errorResponse(state) {

  const attempts = (state.attempts || 0) + 1;

  if (attempts >= 2) {
    return {
      text: `Connecting you to live agent...`,
      newState: { step: 'human', data: {}, attempts: 0 }
    };
  }

  return {
    text: `Unable to understand. Please try again.`,
    newState: { ...state, attempts }
  };
}

module.exports = { decideResponse };
