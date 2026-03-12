/* =====================================================
PAKISTAN VEHICLE ALIAS INTELLIGENCE
===================================================== */

const VEHICLE_ALIASES = {

reborn:{
make:"honda",
model:"civic",
generation:"2006-2011"
},

rebirth:{
make:"honda",
model:"civic",
generation:"2012-2015"
},

turbo:{
make:"honda",
model:"civic",
generation:"2016-2021"
},

civicx:{
make:"honda",
model:"civic",
generation:"2016-2021"
},

grande:{
make:"toyota",
model:"corolla",
generation:"2014-2024"
},

altis:{
make:"toyota",
model:"corolla",
generation:"2014-2024"
},

gli:{
make:"toyota",
model:"corolla",
generation:"2009-2019"
},

xli:{
make:"toyota",
model:"corolla",
generation:"2009-2019"
},

vigo:{
make:"toyota",
model:"hilux",
generation:"2005-2015"
},

revo:{
make:"toyota",
model:"hilux",
generation:"2016-present"
},

rocco:{
make:"toyota",
model:"hilux",
generation:"2020-present"
},

sportage:{
make:"kia",
model:"sportage",
generation:"2019-present"
},

tucson:{
make:"hyundai",
model:"tucson",
generation:"2020-present"
}

}

/* =====================================================
DETECT ALIAS
===================================================== */

function detectVehicleAlias(text){

const query = (text || "")
.toLowerCase()
.replace(/[^a-z0-9\s]/g,"")
.trim()

for(const alias in VEHICLE_ALIASES){

if(query.includes(alias)){
return VEHICLE_ALIASES[alias]
}

}

return null

}

module.exports = {
detectVehicleAlias
}
