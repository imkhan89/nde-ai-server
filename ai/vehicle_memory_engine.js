const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "../data/customer_vehicle_memory.json");

/*
Load customer vehicle memory
*/
function loadMemory() {

    if (!fs.existsSync(MEMORY_FILE)) {
        fs.writeFileSync(MEMORY_FILE, "{}");
    }

    const raw = fs.readFileSync(MEMORY_FILE, "utf8");

    try {
        return JSON.parse(raw);
    } catch (err) {

        console.error("Vehicle memory JSON corrupted. Resetting...");

        fs.writeFileSync(MEMORY_FILE, "{}");

        return {};
    }

}

/*
Save memory to file
*/
function saveMemory(memory) {

    fs.writeFileSync(
        MEMORY_FILE,
        JSON.stringify(memory, null, 2)
    );

}

/*
Save customer's vehicle
*/
function saveCustomerVehicle(phone, vehicle) {

    const memory = loadMemory();

    memory[phone] = {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year
    };

    saveMemory(memory);

}

/*
Get customer's saved vehicle
*/
function getCustomerVehicle(phone) {

    const memory = loadMemory();

    if (memory[phone]) {
        return memory[phone];
    }

    return null;

}

module.exports = {
    saveCustomerVehicle,
    getCustomerVehicle
};
