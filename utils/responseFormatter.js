// utils/responseFormatter.js

function formatProductList({ part, make, model, results }) {
  let message = "";

  // Header
  message += `Product Search: ${capitalize(part)}\n`;
  message += `Vehicle Make: ${capitalize(make)}\n`;
  message += `Model Name: ${capitalize(model)}\n\n`;

  // No results case
  if (!results || results.length === 0) {
    return formatNoResults();
  }

  // Limit results (max 3)
  const limitedResults = results.slice(0, 3);

  message += `Available Options:\n\n`;

  limitedResults.forEach((item, index) => {
    message += `${index + 1}. ${item.title}\n`;
    message += `${item.url}\n\n`;
  });

  message += `For more details visit\n`;
  message += `www.ndestore.com\n\n`;
  message += `Reply # to return to Main Menu`;

  return message;
}

function formatNoResults() {
  return `We were not able to find the required article kindly share the following and our parts expert shall get back to you with exact detail:

Part Name:
Vehicle Make:
Model Name:
Model Year:

Contact Number:
Email Address:`;
}

function formatEscalationToTeam({
  customerNumber,
  email = "",
  part = "",
  make = "",
  model = "",
  year = ""
}) {
  return `UNABLE TO FIND PART

Customer Number: ${customerNumber}
Email Address: ${email || "N/A"}

Part Name: ${part || "N/A"}
Vehicle Make: ${make || "N/A"}
Model Name: ${model || "N/A"}
Model Year: ${year || "N/A"}`;
}

// helper
function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

module.exports = {
  formatProductList,
  formatNoResults,
  formatEscalationToTeam
};
