const { generateProductLink } = require('../shopify-engine/mapper');
const { getShortLink } = require('../database/shortLinks');

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

Share all required parts together with vehicle details.

Example:
Air Filter, Brake Pads, Cabin Filter
Suzuki
Swift
2021`;
}

function buildMultiPartResponse(parts, vehicle) {
  let response = `Vehicle Details:

Make: ${vehicle.make}
Model: ${vehicle.model}
Year: ${vehicle.year || '-'}

Requested Parts:

`;

  parts.forEach((p, index) => {
    const originalLink = generateProductLink({
      ...vehicle,
      part: p
    });

    const shortId = getShortLink(originalLink);
    const shortLink = `https://ndestore.com/${shortId}`;

    response += `${index + 1}. ${p}
${shortLink}

`;
  });

  response += `Reply # to return to Main Menu.`;

  return response;
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

  // MENU
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

    // MISSING VEHICLE
    if (!make || !model) {
      return {
        text: `Please share complete vehicle details:

Make
Model
Year
Part Name(s)

Example:
Suzuki Swift 2021
Air Filter, Brake Pads`,
        newState: state
      };
    }

    // MULTI PART FLOW
    if (parsed.parts.length > 1) {
      return {
        text: buildMultiPartResponse(parsed.parts, parsed.vehicle),
        newState: {
          step: 'auto_parts_result',
          data: parsed.vehicle,
          attempts: 0
        }
      };
    }

    // SINGLE PART
    const originalLink = generateProductLink(parsed.vehicle);
    const shortId = getShortLink(originalLink);
    const shortLink = `https://ndestore.com/${shortId}`;

    return {
      text: `Vehicle Details:

Make: ${make}
Model: ${model}
Year: ${year || '-'}

Part: ${part || '-'}

${shortLink}

Reply # to return to Main Menu.`,
      newState: {
        step: 'auto_parts_result',
        data: parsed.vehicle,
        attempts: 0
      }
    };
  }

  return {
    text: `Unable to understand. Please try again.`,
    newState: {
      ...state,
      attempts: (state.attempts || 0) + 1
    }
  };
}

module.exports = { decideResponse };
