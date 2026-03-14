import rates from "../knowledge/currency_rates.json" assert { type: "json" }

export function convert(price,currency){

if(!rates[currency]) return price

return price * rates[currency]

}
