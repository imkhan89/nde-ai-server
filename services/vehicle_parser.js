import vehicles from "../knowledge/vehicle_dictionary.json" assert { type: "json" }

export function detectVehicle(text){

for(const v of vehicles){

if(text.includes(v)){
return v
}

}

return null

}
