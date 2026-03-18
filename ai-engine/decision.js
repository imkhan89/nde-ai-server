const { generateProductLink } = require('../shopify-engine/mapper');

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

  // RESET
  if (parsed.intent === 'menu' && parsed.value === '#') {
    return {
      text: mainMenu(),
      newState: { step: 'menu', data: {}, attempts: 0 }
    };
  }

  // FIRST MESSAGE
  if (state.step === 'menu' && parsed.intent !== 'menu') {
    return {
      text: mainMenu(),
      newState: { step: 'menu', data: {}, attempts: 0 }
    };
  }

  // MENU HANDLING
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

  // AUTO PARTS FLOW
  if (state.step === 'auto_parts') {

    const { make, model, year, part } = parsed.vehicle;

    // MULTI PART DETECT
    if (parsed.parts.length > 1) {
      return {
        text: `Kindly share all parts with vehicle details.

Example:
Air Filter, Brake Pads
Suzuki
Swift
2021`,
        newState: state
      };
    }

    // MISSING DATA
    if (!make || !model) {
      return {
        text: `Please share complete vehicle details:

Make
Model
Year
Part Name

Example:
Suzuki Swift 2021 Brake Pads`,
        newState: state
      };
    }

    // GENERATE LINK
    const link = generateProductLink(parsed.vehicle);

    // SUCCESS RESPONSE
    return {
      text: `Vehicle Details:

Make: ${make}
Model: ${model}
Year: ${year || '-'}

Part: ${part || '-'}

Kindly visit the following link:
${link}

Reply # to return to Main Menu.`,
      newState: {
        step: 'auto_parts_result',
        data: parsed.vehicle,
        attempts: 0
      }
    };
  }

  // DEFAULT ERROR
  return {
    text: `Unable to understand. Please try again.`,
    newState: {
      ...state,
      attempts: (state.attempts || 0) + 1
    }
  };
}

module.exports = { decideResponse };
