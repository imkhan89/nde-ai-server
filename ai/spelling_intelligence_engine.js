/*
Automotive Spelling Intelligence Engine
Corrects common WhatsApp typing mistakes
*/

const dictionary = {

oil:["oil","oill","oiil"],
filter:["filter","filtar","filtr","fiter","filtre"],
air:["air","eir"],
cabin:["cabin","cabn","cabbin"],
brake:["brake","break","brak"],
pad:["pad","pads","padd"],
disc:["disc","disk","dics"],
coolant:["coolant","colant","coolent"],
radiator:["radiator","rediator","radiater"],

honda:["honda","hond"],
toyota:["toyota","toyotaa","toyotaa"],
suzuki:["suzuki","suzki","suzuky"],
kia:["kia","kiya"],
mg:["mg"],
hyundai:["hyundai","hundai","hyundia"],

city:["city","citi"],
civic:["civic","civc"],
corolla:["corolla","corola"],
yaris:["yaris","yars"],
swift:["swift","swft","swiftt"],
cultus:["cultus","cultis"],
alto:["alto","altoo"],
wagonr:["wagonr","wagon","wagnr"],
sportage:["sportage","sportag"],
tucson:["tucson","tuscon"],
elantra:["elantra","elantr"],
picanto:["picanto","picantoo"]

}

/* NORMALIZE */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* SPELL CORRECT */

function correctWord(word){

for(const key in dictionary){

if(dictionary[key].includes(word)){
return key
}

}

return word

}

/* CORRECT MESSAGE */

function correctSpelling(message){

const clean = normalize(message)

const tokens = clean.split(" ")

const corrected = tokens.map(w => correctWord(w))

return corrected.join(" ")

}

module.exports = correctSpelling
