function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

const vehicleMap = {

corolla:"toyota",
civic:"honda",
city:"honda",
alto:"suzuki",
cultus:"suzuki",
swift:"suzuki",
wagonr:"suzuki",
mehran:"suzuki",
bolan:"suzuki",
carry:"suzuki",
yaris:"toyota",
revo:"toyota",
hilux:"toyota",
sportage:"kia",
elantra:"hyundai",
tucson:"hyundai",
sonata:"hyundai"

}

function detectVehicle(text){

const t = normalize(text)

let detected = null

Object.keys(vehicleMap).forEach(model=>{

if(t.includes(model)){

detected = {
make: vehicleMap[model],
model: model
}

}

})

return detected

}

module.exports = {
detectVehicle
}
