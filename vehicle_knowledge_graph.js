/* =====================================================
AUTOMOTIVE VEHICLE KNOWLEDGE GRAPH
Pakistan vehicle intelligence
===================================================== */

const VEHICLE_ALIASES = {

reborn:{ make:"honda", model:"civic", generation:"2006-2011" },
rebirth:{ make:"honda", model:"civic", generation:"2012-2015" },
turbo:{ make:"honda", model:"civic", generation:"2016-2021" },

grande:{ make:"toyota", model:"corolla", generation:"2014-2019" },
altis:{ make:"toyota", model:"corolla", generation:"2014-2019" },
gli:{ make:"toyota", model:"corolla", generation:"2014-2019" },
xli:{ make:"toyota", model:"corolla", generation:"2014-2019" },

vigo:{ make:"toyota", model:"hilux", generation:"2005-2015" },
revo:{ make:"toyota", model:"hilux", generation:"2016-present" },
rocco:{ make:"toyota", model:"hilux", generation:"2020-present" },

aspire:{ make:"honda", model:"city", generation:"2013-2021" },

sportage:{ make:"kia", model:"sportage", generation:"2019-present" },
tucson:{ make:"hyundai", model:"tucson", generation:"2020-present" }

}

/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
ALIAS DETECTION
===================================================== */

function detectVehicleAlias(text){

const query = normalize(text)

let detected = null
let longestMatch = 0

for(const alias in VEHICLE_ALIASES){

if(query.includes(alias)){

if(alias.length > longestMatch){

detected = VEHICLE_ALIASES[alias]
longestMatch = alias.length

}

}

}

return detected

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {
detectVehicleAlias
}
