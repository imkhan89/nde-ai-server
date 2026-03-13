function getRecommendations(part){

part = (part || "").toLowerCase()

const recommendations = {

"air filter":[
"Cabin AC Filter",
"Engine Oil Filter",
"Spark Plugs"
],

"oil filter":[
"Engine Oil",
"Drain Plug Washer",
"Air Filter"
],

"brake pads":[
"Brake Rotors",
"Brake Fluid",
"Caliper Grease"
],

"spark plugs":[
"Ignition Coils",
"Air Filter",
"Fuel Injector Cleaner"
]

}

for(const key in recommendations){

if(part.includes(key)){
return recommendations[key]
}

}

return []

}

module.exports = {
getRecommendations
}
