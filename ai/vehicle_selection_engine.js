import db from "../database/database.js";

export function getVehicleMakes() {
  const stmt = db.prepare(`
    SELECT DISTINCT vehicle_make AS make
    FROM compatibility
    WHERE vehicle_make IS NOT NULL
    ORDER BY vehicle_make
  `);

  return stmt.all().map(r => r.make);
}

export function getVehicleModels(make) {
  const stmt = db.prepare(`
    SELECT DISTINCT vehicle_model AS model
    FROM compatibility
    WHERE vehicle_make = ?
    ORDER BY vehicle_model
  `);

  return stmt.all(make).map(r => r.model);
}

export function getVehicleYears(make, model) {
  const stmt = db.prepare(`
    SELECT DISTINCT vehicle_year AS year
    FROM compatibility
    WHERE vehicle_make = ?
    AND vehicle_model = ?
    ORDER BY vehicle_year
  `);

  return stmt.all(make, model).map(r => r.year);
}

export function getVehicleParts(make, model, year) {
  const stmt = db.prepare(`
    SELECT DISTINCT part_name, brand_name
    FROM compatibility
    WHERE vehicle_make = ?
    AND vehicle_model = ?
    AND (vehicle_year = ? OR vehicle_year IS NULL)
  `);

  return stmt.all(make, model, year);
}

export default {
  getVehicleMakes,
  getVehicleModels,
  getVehicleYears,
  getVehicleParts
};
