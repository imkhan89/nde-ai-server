/* =====================================================
AUTOMOTIVE KNOWLEDGE GRAPH
Pakistan Vehicle Naming Intelligence
===================================================== */

const VEHICLE_ALIASES = {

reborn:{
make:"honda",
model:"civic",
start:2006,
end:2011,
engine:"r18a"
},

rebirth:{
make:"honda",
model:"civic",
start:2012,
end:2015,
engine:"r18z"
},

civicx:{
make:"honda",
model:"civic",
start:2016,
end:2020,
engine:"l15b"
},

grande:{
make:"toyota",
model:"corolla",
start:2014,
end:2017,
engine:"2zr-fe"
},

gli:{
make:"toyota",
model:"corolla",
start:2009,
end:2013,
engine:"1zr-fe"
},

altis:{
make:"toyota",
model:"corolla",
start:2009,
end:2013,
engine:"1zr-fe"
},

vigo:{
make:"toyota",
model:"hilux",
start:2005,
end:2014,
engine:"1kd-ftv"
},

revo:{
make:"toyota",
model:"hilux",
start:2015,
end:2023,
engine:"1gd-ftv"
}

};


/* =====================================================
FITMENT DATABASE
Vehicle → Engine → Compatible Parts
===================================================== */

const FITMENT_DATABASE = {

honda:{
civic:{
"r18a":{
oil_filter:["15400-PLM-A02","Bosch 0986AF0051","Denso 150-3020"],
air_filter:["17220-RNA-A00"],
spark_plug:["NGK IFR6J11","Denso SKJ20DR-M11"]
},
"r18z":{
oil_filter:["15400-RTA-003","Bosch 0986AF0051"],
air_filter:["17220-R1A-A01"]
},
"l15b":{
oil_filter:["15400-RTA-003"],
air_filter:["17220-5AA-A00"]
}
}
},

toyota:{
corolla:{
"1zr-fe":{
oil_filter:["04152-YZZA1","Denso 150-3020","Bosch 0986AF0051"],
air_filter:["17801-21060"]
},
"2zr-fe":{
oil_filter:["04152-YZZA1","Denso 150-3020"],
air_filter:["17801-37021"]
}
},

hilux:{
"1kd-ftv":{
oil_filter:["90915-YZZD2"],
air_filter:["17801-0L040"]
},
"1gd-ftv":{
oil_filter:["04152-YZZA5"],
air_filter:["17801-0L060"]
}
}

}

};


/* =====================================================
ALIAS VEHICLE DETECTION
===================================================== */

function resolveVehicle(text){

text = text.toLowerCase();

for(const alias in VEHICLE_ALIASES){

if(text.includes(alias)){

const v = VEHICLE_ALIASES[alias];

return {
make:v.make,
model:v.model,
year:v.start,
engine:v.engine
};

}

}

return null;

}


/* =====================================================
PART COMPATIBILITY LOOKUP
===================================================== */

function getCompatibleParts(make,model,engine,part){

try{

const makeData = FITMENT_DATABASE[make];
if(!makeData) return null;

const modelData = makeData[model];
if(!modelData) return null;

const engineData = modelData[engine];
if(!engineData) return null;

const parts = engineData[part];
if(!parts) return null;

return {
engine:engine,
parts:parts
};

}catch(e){

return null;

}

}


/* =====================================================
EXPORTS
===================================================== */

module.exports = {

resolveVehicle,
getCompatibleParts

};
