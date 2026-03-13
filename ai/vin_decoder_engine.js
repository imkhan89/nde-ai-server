const vinDatabase = {
JTDBR32E: {make:"toyota",model:"corolla"},
MRHFC: {make:"honda",model:"civic"},
JHMGM: {make:"honda",model:"city"},
MA3: {make:"suzuki"},
KMH: {make:"hyundai"},
KNA: {make:"kia"},
SAL: {make:"land rover"},
WDB: {make:"mercedes"},
WAU: {make:"audi"},
WVW: {make:"volkswagen"}
}

function normalize(text){

return (text || "")
.toUpperCase()
.replace(/[^A-Z0-9]/g,"")
.trim()

}

function isVIN(text){

const vin = normalize(text)

if(vin.length !== 17) return false

return true

}

function decodeVIN(text){

const vin = normalize(text)

if(!isVIN(vin)){
return null
}

const prefix = vin.substring(0,3)

const extended = vin.substring(0,5)

if(vinDatabase[extended]){
return vinDatabase[extended]
}

if(vinDatabase[prefix]){
return vinDatabase[prefix]
}

return {
make:"unknown",
model:"unknown"
}

}

module.exports = {
decodeVIN,
isVIN
}
