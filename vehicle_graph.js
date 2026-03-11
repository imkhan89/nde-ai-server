/* =====================================================
AUTOMOTIVE VEHICLE KNOWLEDGE GRAPH
Understands Pakistani vehicle naming
===================================================== */

const VEHICLE_GRAPH = {

alto: { make:"suzuki", model:"alto" },
cultus: { make:"suzuki", model:"cultus" },
swift: { make:"suzuki", model:"swift" },
wagonr: { make:"suzuki", model:"wagonr" },
mehran: { make:"suzuki", model:"mehran" },
bolan: { make:"suzuki", model:"bolan" },
ravi: { make:"suzuki", model:"ravi" },
jimny: { make:"suzuki", model:"jimny" },

corolla: { make:"toyota", model:"corolla" },
yaris: { make:"toyota", model:"yaris" },
hilux: { make:"toyota", model:"hilux" },
fortuner: { make:"toyota", model:"fortuner" },
prado: { make:"toyota", model:"prado" },
landcruiser: { make:"toyota", model:"land cruiser" },
landcruiserprado: { make:"toyota", model:"land cruiser prado" },

civic: { make:"honda", model:"civic" },
city: { make:"honda", model:"city" },
brv: { make:"honda", model:"brv" },
hrv: { make:"honda", model:"hrv" },
crv: { make:"honda", model:"crv" },
vezel: { make:"honda", model:"vezel" },
accord: { make:"honda", model:"accord" },

picanto: { make:"kia", model:"picanto" },
sportage: { make:"kia", model:"sportage" },
stonic: { make:"kia", model:"stonic" },
sorento: { make:"kia", model:"sorento" },
carnival: { make:"kia", model:"carnival" },

tucson: { make:"hyundai", model:"tucson" },
elantra: { make:"hyundai", model:"elantra" },
sonata: { make:"hyundai", model:"sonata" },
santafe: { make:"hyundai", model:"santa fe" },

hs: { make:"mg", model:"hs" },
zs: { make:"mg", model:"zs" },

alsvin: { make:"changan", model:"alsvin" },
oshan: { make:"changan", model:"oshan x7" },

glory580: { make:"dfsk", model:"glory 580" },

saga: { make:"proton", model:"saga" },
x70: { make:"proton", model:"x70" },

h6: { make:"haval", model:"h6" }

}


/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}


/* =====================================================
DETECT VEHICLE
===================================================== */

function detectVehicle(text){

const query = normalize(text)

for(const alias in VEHICLE_GRAPH){

if(query.includes(alias)){
return VEHICLE_GRAPH[alias]
}

}

return null

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {
detectVehicle
}
