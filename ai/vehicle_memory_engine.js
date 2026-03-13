const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const MEMORY_FILE = path.join(DATA_DIR, "customer_vehicle_memory.json");

let memory = {};

function loadVehicleMemory() {

    try {

        if (!fs.existsSync(MEMORY_FILE)) {
            fs.writeFileSync(MEMORY_FILE, JSON.stringify({}));
        }

        const data = fs.readFileSync(MEMORY_FILE);

        memory = JSON.parse(data);

        console.log("Customer vehicle memory loaded");

    } catch (err) {

        console.log("Vehicle memory load error");

        memory = {};

    }
}

function saveVehicleMemory() {

    try {

        fs.writeFileSync(
            MEMORY_FILE,
            JSON.stringify(memory, null, 2)
        );

    } catch (err) {

        console.log("Vehicle memory save error");

    }
}

function rememberVehicle(phone, make, model, year) {

    if (!phone || !make || !model) return;

    memory[phone] = {
        make,
        model,
        year,
        updated: new Date().toISOString()
    };

    saveVehicleMemory();

    console.log("Vehicle saved for:", phone);

}

function getCustomerVehicle(phone) {

    if (!memory[phone]) return null;

    return memory[phone];

}

function applyCustomerVehicle(phone, query) {

    const vehicle = getCustomerVehicle(phone);

    if (!vehicle) return query;

    const text = query.toLowerCase();

    const vehicleWords = [
        vehicle.make.toLowerCase(),
        vehicle.model.toLowerCase()
    ];

    const alreadyContainsVehicle =
        vehicleWords.some(v => text.includes(v));

    if (alreadyContainsVehicle) return query;

    return `${query} ${vehicle.make} ${vehicle.model} ${vehicle.year}`;

}

module.exports = {
    loadVehicleMemory,
    rememberVehicle,
    getCustomerVehicle,
    applyCustomerVehicle
};
