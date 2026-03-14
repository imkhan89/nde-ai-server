import countries from "../knowledge/country_detection.json" with { type: "json" }

export function detectCountry(phone){

for(const prefix in countries){

if(phone.startsWith(prefix)){
return countries[prefix]
}

}

return "Unknown"

}
