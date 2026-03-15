const COUNTRY_CODES = {
  "92": { country: "Pakistan", currency: "PKR" },
  "44": { country: "United Kingdom", currency: "GBP" },
  "1": { country: "United States", currency: "USD" },
  "971": { country: "UAE", currency: "AED" },
  "61": { country: "Australia", currency: "AUD" },
  "49": { country: "Germany", currency: "EUR" },
  "33": { country: "France", currency: "EUR" },
  "39": { country: "Italy", currency: "EUR" },
  "34": { country: "Spain", currency: "EUR" },
  "91": { country: "India", currency: "INR" },
  "966": { country: "Saudi Arabia", currency: "SAR" },
  "974": { country: "Qatar", currency: "QAR" },
  "965": { country: "Kuwait", currency: "KWD" }
}

export function detectCustomerCountry(phone) {

  if (!phone) {
    return {
      country: "Unknown",
      currency: "USD",
      international: true
    }
  }

  const number = phone.replace("whatsapp:+", "")

  for (const code in COUNTRY_CODES) {
    if (number.startsWith(code)) {

      const data = COUNTRY_CODES[code]

      return {
        country: data.country,
        currency: data.currency,
        international: code !== "92"
      }

    }
  }

  return {
    country: "International",
    currency: "USD",
    international: true
  }

}
