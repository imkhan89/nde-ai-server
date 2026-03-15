import db from "../database/database.js";

function addRelation({ make, model, year, part, brand }) {
  const stmt = db.prepare(`
    INSERT INTO compatibility
    (vehicle_make, vehicle_model, vehicle_year, part_name, brand_name)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    make || "",
    model || "",
    year || null,
    part || "",
    brand || ""
  );
}

function getVehicleParts(make, model, year) {
  const stmt = db.prepare(`
    SELECT part_name, brand_name
    FROM compatibility
    WHERE vehicle_make = ?
    AND vehicle_model = ?
    AND vehicle_year = ?
  `);

  return stmt.all(make, model, year);
}

function getPartVehicles(part) {
  const stmt = db.prepare(`
    SELECT vehicle_make, vehicle_model, vehicle_year
    FROM compatibility
    WHERE part_name = ?
  `);

  return stmt.all(part);
}

function getBrandParts(brand) {
  const stmt = db.prepare(`
    SELECT part_name
    FROM compatibility
    WHERE brand_name = ?
  `);

  return stmt.all(brand);
}

export {
  addRelation,
  getVehicleParts,
  getPartVehicles,
  getBrandParts
};

export default {
  addRelation,
  getVehicleParts,
  getPartVehicles,
  getBrandParts
};
