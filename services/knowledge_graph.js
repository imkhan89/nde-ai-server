/*
NDE Automotive AI
Automotive Knowledge Graph

Stores relationships between vehicles, parts, brands,
and compatibility data. Enables AI reasoning.
*/

const GRAPH = {
  vehicles: {},
  parts: {},
  brands: {},
  relations: []
};

/*
Add vehicle node
*/

export function addVehicle(make, model) {

  if (!make || !model) return;

  make = make.toLowerCase();
  model = model.toLowerCase();

  if (!GRAPH.vehicles[make]) {
    GRAPH.vehicles[make] = {};
  }

  if (!GRAPH.vehicles[make][model]) {
    GRAPH.vehicles[make][model] = {
      parts: new Set(),
      brands: new Set()
    };
  }

}

/*
Add part node
*/

export function addPart(part) {

  if (!part) return;

  part = part.toLowerCase();

  if (!GRAPH.parts[part]) {
    GRAPH.parts[part] = {
      vehicles: new Set(),
      brands: new Set()
    };
  }

}

/*
Add brand node
*/

export function addBrand(brand) {

  if (!brand) return;

  brand = brand.toLowerCase();

  if (!GRAPH.brands[brand]) {
    GRAPH.brands[brand] = {
      parts: new Set(),
      vehicles: new Set()
    };
  }

}

/*
Create relationship
*/

export function connect(make, model, part, brand) {

  if (!make || !model || !part) return;

  addVehicle(make, model);
  addPart(part);

  if (brand) {
    addBrand(brand);
  }

  GRAPH.vehicles[make][model].parts.add(part);

  if (brand) {
    GRAPH.vehicles[make][model].brands.add(brand);
  }

  GRAPH.parts[part].vehicles.add(`${make}_${model}`);

  if (brand) {
    GRAPH.parts[part].brands.add(brand);
  }

  if (brand) {
    GRAPH.brands[brand].parts.add(part);
    GRAPH.brands[brand].vehicles.add(`${make}_${model}`);
  }

  GRAPH.relations.push({
    make,
    model,
    part,
    brand
  });

}

/*
Query graph
*/

export function getVehicleParts(make, model) {

  if (!make || !model) return [];

  make = make.toLowerCase();
  model = model.toLowerCase();

  if (!GRAPH.vehicles[make]) return [];
  if (!GRAPH.vehicles[make][model]) return [];

  return Array.from(GRAPH.vehicles[make][model].parts);

}

export function getPartVehicles(part) {

  if (!part) return [];

  part = part.toLowerCase();

  if (!GRAPH.parts[part]) return [];

  return Array.from(GRAPH.parts[part].vehicles);

}

export function getBrandParts(brand) {

  if (!brand) return [];

  brand = brand.toLowerCase();

  if (!GRAPH.brands[brand]) return [];

  return Array.from(GRAPH.brands[brand].parts);

}

/*
Expose graph
*/

export function getKnowledgeGraph() {
  return GRAPH;
}
