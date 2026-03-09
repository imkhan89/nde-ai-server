/* =====================================================
AUTOMOTIVE VEHICLE KNOWLEDGE GRAPH
Understands Pakistani vehicle naming
===================================================== */

const VEHICLE_GRAPH = {

"reborn":{
make:"honda",
model:"civic",
generation:"2006-2011"
},

"rebirth":{
make:"honda",
model:"civic",
generation:"2012-2015"
},

"civic":{
make:"honda",
model:"civic"
},

"grande":{
make:"toyota",
model:"corolla",
generation:"2014-2019"
},

"altis":{
make:"toyota",
model:"corolla"
},

"gli":{
make:"toyota",
model:"corolla"
},

"xli":{
make:"toyota",
model:"corolla"
},

"vigo":{
make:"toyota",
model:"hilux",
generation:"2005-2015"
},

"revo":{
make:"toyota",
model:"hilux",
generation:"2016-present"
},

"h6":{
make:"haval",
model:"h6"
}

}

/* =====================================================
DETECT VEHICLE
===================================================== */

function detectVehicle(text){

const query = (text || "").toLowerCase()

for(const alias in VEHICLE_GRAPH){

if(query.includes(alias)){
return VEHICLE_GRAPH[alias]
}

}

return null

}

module.exports = {
detectVehicle
}
