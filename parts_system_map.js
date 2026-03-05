/* VEHICLE SYSTEM DETECTION */

const PARTS_SYSTEM_MAP = {

Engine: [
"engine mount",
"piston",
"timing chain",
"timing belt",
"valve cover gasket"
],

Cooling: [
"radiator",
"radiator cap",
"coolant",
"thermostat",
"water pump"
],

Braking: [
"brake pad",
"brake pads",
"brake rotor",
"brake disc",
"brake shoe",
"brake drum"
],

Filters: [
"oil filter",
"air filter",
"cabin filter",
"ac filter",
"fuel filter"
],

Suspension: [
"shock absorber",
"strut",
"control arm",
"bushing",
"stabilizer link"
],

Electrical: [
"spark plug",
"ignition coil",
"battery",
"alternator",
"starter motor"
],

Body: [
"bumper",
"side mirror",
"fender",
"hood",
"door handle"
]

};

module.exports = PARTS_SYSTEM_MAP;
