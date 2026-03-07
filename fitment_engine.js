/* =====================================================
AUTOMOTIVE FITMENT INTELLIGENCE ENGINE
Pakistan Vehicle Alias Recognition
===================================================== */

/* =====================================================
VEHICLE ALIASES
Local market naming used by customers
===================================================== */

const VEHICLE_ALIASES = {

reborn:{
make:"Honda",
model:"Civic",
years:[2006,2007,2008,2009,2010,2011]
},

rebirth:{
make:"Honda",
model:"Civic",
years:[2012,2013,2014,2015]
},

civicx:{
make:"Honda",
model:"Civic",
years:[2016,2017,2018,2019,2020]
},

grande:{
make:"Toyota",
model:"Corolla",
years:[2015,2016,2017]
},

gli:{
make:"Toyota",
model:"Corolla",
years:[2009,2010,2011,2012,2013]
},

altis:{
make:"Toyota",
model:"Corolla",
years:[2009,2010,2011,2012,2013]
},

vigo:{
make:"Toyota",
model:"Hilux",
years:[2005,2006,2007,2008,2009,2010,2011,2012,2013,2014]
},

revo:{
make:"Toyota",
model:"Hilux",
years:[2015,2016,2017,2018,2019,2020,2021,2022,2023]
}

};

/* =====================================================
YEAR DETECTION
===================================================== */

function detectYear(text){

const match=text.match(/\b(19|20)\d{2}\b/)

return match?parseInt(match[0]):null

}

/* =====================================================
ALIAS DETECTION
===================================================== */

function detectAlias(text){

for(const alias in VEHICLE_ALIASES){

if(text.includes(alias)){

return VEHICLE_ALIASES[alias]

}

}

return null

}

/* =====================================================
FITMENT RESOLVER
===================================================== */

function resolveVehicle(text){

text=text.toLowerCase()

const year=detectYear(text)

const alias=detectAlias(text)

if(alias){

return{

make:alias.make,
model:alias.model,
year:year || alias.years[0]

}

}

return null

}

module.exports={

resolveVehicle

}
