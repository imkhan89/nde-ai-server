/* =====================================================
PAKISTAN VEHICLE DEFAULTS
===================================================== */

function applyVehicleDefaults(make, model){

if(make === "toyota" && !model){

model = "corolla"

}

if(make === "honda" && !model){

model = "civic"

}

if(make === "suzuki" && !model){

model = "alto"

}

if(make === "kia" && !model){

model = "sportage"

}

if(make === "hyundai" && !model){

model = "elantra"

}

return { make, model }

}


module.exports = {

applyVehicleDefaults

}
