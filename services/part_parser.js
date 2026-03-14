import parts from "../knowledge/part_dictionary.json" assert { type: "json" }

export function detectPart(text){

for(const p of parts){

if(text.includes(p)){
return p
}

}

return null

}
