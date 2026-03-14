import dictionary from "../knowledge/spelling_dictionary.json" with { type: "json" }

export function correctSpelling(text){

let corrected = text

for(const wrong in dictionary){

const correct = dictionary[wrong]

corrected = corrected.replace(wrong,correct)

}

return corrected

}
