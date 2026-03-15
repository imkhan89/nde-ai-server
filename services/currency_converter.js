export function convertCurrencyPKR(pricePKR, country) {
  const rates = {
    USD: 278,
    GBP: 350,
    AED: 76,
    AUD: 182,
    INR: 3.3
  };

  const price = Number(pricePKR);

  const usd = (price / rates.USD).toFixed(2);

  let local = "";

  switch (country) {
    case "United Kingdom":
      local = `GBP ${(price / rates.GBP).toFixed(2)}`;
      break;

    case "UAE":
      local = `AED ${(price / rates.AED).toFixed(2)}`;
      break;

    case "Australia":
      local = `AUD ${(price / rates.AUD).toFixed(2)}`;
      break;

    case "India":
      local = `INR ${(price / rates.INR).toFixed(2)}`;
      break;

    default:
      local = `USD ${usd}`;
  }

  return {
    pkr: `PKR ${price}`,
    usd: `USD ${usd}`,
    local
  };
}
