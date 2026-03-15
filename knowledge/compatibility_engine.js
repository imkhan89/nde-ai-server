import db from "../database/database.js";

function findCompatibleParts(make, model, year) {
  const stmt = db.prepare(`
    SELECT part_name, brand_name
    FROM compatibility
    WHERE vehicle_make = ?
    AND vehicle_model = ?
    AND (vehicle_year = ? OR vehicle_year IS NULL)
  `);

  return stmt.all(make, model, year);
}

function findCompatibleVehicles(partName) {
  const stmt = db.prepare(`
    SELECT vehicle_make, vehicle_model, vehicle_year
    FROM compatibility
    WHERE part_name = ?
  `);

  return stmt.all(partName);
}

function checkCompatibility({ make, model, year, part }) {
  const stmt = db.prepare(`
    SELECT *
    FROM compatibility
    WHERE vehicle_make = ?
    AND vehicle_model = ?
    AND part_name = ?
    AND (vehicle_year = ? OR vehicle_year IS NULL)
    LIMIT 1
  `);

  const result = stmt.get(make, model, part, year);

  return Boolean(result);
}

function findBrandsForPart(partName) {
  const stmt = db.prepare(`
    SELECT DISTINCT brand_name
    FROM compatibility
    WHERE part_name = ?
  `);

  return stmt.all(partName);
}

export {
  findCompatibleParts,
  findCompatibleVehicles,
  checkCompatibility,
  findBrandsForPart
};

export default {
  findCompatibleParts,
  findCompatibleVehicles,
  checkCompatibility,
  findBrandsForPart
};
