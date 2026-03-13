function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function detectYear(text){

const yearMatch = text.match(/\b(19|20)\d{2}\b/)

if(yearMatch){
return yearMatch[0]
}

return null

}

function detectMake(text){

const makes = [
"toyota",
"honda",
"suzuki",
"daihatsu",
"nissan",
"mitsubishi",
"kia",
"hyundai",
"changan",
"proton",
"mg",
"chevrolet"
]

for(let make of makes){

if(text.includes(make)){
return make
}

}

return null

}

function detectModel(text){

const models = [
"corolla",
"civic",
"city",
"alto",
"cultus",
"swift",
"wagonr",
"mehran",
"bolan",
"carry",
"yaris",
"revo",
"hilux",
"sportage",
"elantra",
"tucson",
"sonata"
]

for(let model of models){

if(text.includes(model)){
return model
}

}

return null

}

function detectPart(text){

const parts = [
"air filter",
"oil filter",
"cabin filter",
"ac filter",
"spark plug",
"brake pad",
"brake pads",
"brake disc",
"brake rotor",
"radiator",
"radiator cap",
"engine mount",
"engine mounting",
"wheel bearing",
"clutch plate",
"clutch kit",
"fuel filter",
"wiper blade",
"horn",
"headlight",
"tail light"
]

for(let part of parts){

if(text.includes(part)){
return part
}

}

return null

}

function parseVehicleQuery(message){

const text = normalize(message)

return {
part: detectPart(text),
make: detectMake(text),
model: detectModel(text),
year: detectYear(text)
}

}

module.exports = {
parseVehicleQuery
}
