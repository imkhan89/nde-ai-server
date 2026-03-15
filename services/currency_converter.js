const RATES = {
  USD: 280,
  GBP: 355,
  EUR: 300,
  AED: 76,
  SAR: 74,
  AUD: 185,
  CAD: 205,
  PKR: 1
}

export function convertFromPKR(amountPKR, currency) {

  if (!amountPKR) return null

  const rate = RATES[currency]

  if (!rate) return null

  const converted = amountPKR / rate

  return converted.toFixed(2)

}

export function formatPriceSet(amountPKR, customerCurrency) {

  const pkr = Number(amountPKR)

  if (!pkr) return ""

  const usd = convertFromPKR(pkr, "USD")

  const local = convertFromPKR(pkr, customerCurrency)

  let localLabel = customerCurrency

  if (customerCurrency === "GBP") localLabel = "£"
  if (customerCurrency === "USD") localLabel = "$"
  if (customerCurrency === "EUR") localLabel = "€"
  if (customerCurrency === "AED") localLabel = "AED"
  if (customerCurrency === "SAR") localLabel = "SAR"

  return `PKR ${pkr}
USD $${usd}
${localLabel} ${local}`
}
