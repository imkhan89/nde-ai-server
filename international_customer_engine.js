function detectInternationalCustomer(phone){

if(!phone) return false

if(!phone.startsWith("+92")){
return true
}

return false

}

function verifyLocation(text){

const t=(text || "").toLowerCase()

const pakistanCities=[
"lahore",
"karachi",
"islamabad",
"faisalabad",
"multan",
"rawalpindi",
"peshawar",
"sialkot",
"gujranwala"
]

for(const city of pakistanCities){

if(t.includes(city)){
return "domestic"
}

}

return "international"

}

module.exports={

detectInternationalCustomer,
verifyLocation

}
