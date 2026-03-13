function parseVehicleQuery(text){

text = text.toLowerCase().trim()

const parts = text.split(" ")

let year = null
let make = null
let model = null
let part = []

parts.forEach(word => {

if(/^(19|20)\d{2}$/.test(word)){
year = word
return
}

if(!make){
make = word
return
}

if(!model){
model = word
return
}

part.push(word)

})

return {
part: part.join(" "),
make,
model,
year
}

}

module.exports = {
parseVehicleQuery
}
