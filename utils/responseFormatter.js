function formatSearchResponse(data) {
  const { query, results } = data;

  const part = query.part || "-";
  const make = query.make || "-";
  const model = query.model || "-";

  // LIMIT RESULTS (MAX 3)
  const limitedResults = results.slice(0, 3);

  // ❌ NO RESULTS
  if (!limitedResults.length) {
    return formatNoResults(query);
  }

  // ✅ HEADER
  let message = `Product Search: ${part}
Vehicle Make: ${make}
Model Name: ${model}

Available Options:

`;

  // ✅ OPTIONS
  limitedResults.forEach((item, index) => {
    message += `${index + 1}. ${item.title}
${item.url}

`;
  });

  // ✅ FOOTER
  message += `For more details visit
www.ndestore.com

Reply # to return to Main Menu`;

  return message;
}
