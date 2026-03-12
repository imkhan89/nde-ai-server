/*
Professional Response Builder
Formats replies sent to WhatsApp
*/

function capitalize(text){

if(!text) return ""

return text
.split(" ")
.map(w => w.charAt(0).toUpperCase() + w.slice(1))
.join(" ")

}

function buildPartsResponse(data){

if(!data){

return `
We are unable to understand your inquiry.

Kindly reply in the following format:

Part Description (e.g. Air Filter)
Vehicle Make (e.g. Suzuki)
Vehicle Model (e.g. Swift)
Model Year (e.g. 2021)

Example:
Air Filter Suzuki Swift 2021

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288
`

}

const part = capitalize(data.part)
const make = capitalize(data.make)
const model = capitalize(data.model)
const year = data.year || "Not Provided"

return `
Part Description: ${part}
Vehicle Make: ${make}
Vehicle Model: ${model}
Model Year: ${year}

Kindly visit the following URL:
${data.url}

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288
`

}

module.exports = buildPartsResponse
