/* =====================================================
AUTOMOTIVE KNOWLEDGE GRAPH
Pakistan Vehicle Naming Intelligence
===================================================== */

const VEHICLE_ALIASES = {

reborn:{
make:"honda",
model:"civic",
start:2006,
end:2011
},

rebirth:{
make:"honda",
model:"civic",
start:2012,
end:2015
},

civicx:{
make:"honda",
model:"civic",
start:2016,
end:2020
},

grande:{
make:"toyota",
model:"corolla",
start:2014,
end:2017
},

gli:{
make:"toyota",
model:"corolla",
start:2009,
end:2013
},

altis:{
make:"toyota",
model:"corolla",
start:2009,
end:2013
},

vigo:{
make:"toyota",
model:"hilux",
start:2005,
end:2014
},

revo:{
make:"toyota",
model:"hilux",
start:2015,
end:2023
}

};

/* =====================================================
ALIAS VEHICLE DETECTION
===================================================== */

function resolveVehicle(text){

text=text.toLowerCase();

for(const alias in VEHICLE_ALIASES){

if(text.includes(alias)){

const v=VEHICLE_ALIASES[alias];

return {

make:v.make,
model:v.model,
year:v.start

};

}

}

return null;

}

module.exports={

resolveVehicle

};
