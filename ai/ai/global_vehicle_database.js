const fs = require("fs");
const path = require("path");

const VEHICLE_DB_PATH = path.join(__dirname, "../data/global_vehicle_database.json");

let vehicleDB = [];

/*
Load vehicle database
*/
function loadVehicleDatabase() {
    try {

        if (!fs.existsSync(VEHICLE_DB_PATH)) {
            console.log("Global vehicle database not found");
            vehicleDB = [];
            return;
        }

        const raw = fs.readFileSync(VEHICLE_DB_PATH);
        vehicleDB = JSON.parse(raw);

        console.log("Global vehicle database loaded");
        console.log("Total vehicles:", vehicleDB.length);

    } catch (error) {

        console.error("Vehicle database load error:", error);
        vehicleDB = [];

    }
}

/*
Search vehicle by make / model
*/
function findVehicle(make, model) {

    make = make.toLowerCase();
    model = model.toLowerCase();

    const results = vehicleDB.filter(v => {

        return (
            v.make.toLowerCase() === make &&
            v.model.toLowerCase() === model
        );

    });

    return results;
}

/*
Check if year matches range
*/
function matchYear(vehicle, year) {

    if (!year) return true;

    const start = parseInt(vehicle.start_year);
    const end = parseInt(vehicle.end_year);

    year = parseInt(year);

    return year >= start && year <= end;
}

/*
Get vehicle with year validation
*/
function detectVehicle(make, model, year) {

    const matches = findVehicle(make, model);

    if (!matches.length) return null;

    if (!year) return matches[0];

    for (let v of matches) {

        if (matchYear(v, year)) {
            return v;
        }

    }

    return matches[0];
}

/*
Return all makes
*/
function getAllMakes() {

    const makes = new Set();

    vehicleDB.forEach(v => makes.add(v.make));

    return Array.from(makes);

}

/*
Return models for make
*/
function getModelsByMake(make) {

    const models = new Set();

    vehicleDB.forEach(v => {

        if (v.make.toLowerCase() === make.toLowerCase()) {
            models.add(v.model);
        }

    });

    return Array.from(models);

}

module.exports = {

    loadVehicleDatabase,
    detectVehicle,
    findVehicle,
    getAllMakes,
    getModelsByMake

};
