const services = new Map();

export function registerService(name, instance) {
  if (!name) {
    throw new Error("Service name is required");
  }

  services.set(name, instance);
}

export function getService(name) {
  return services.get(name);
}

export function hasService(name) {
  return services.has(name);
}

export function listServices() {
  return Array.from(services.keys());
}

export function removeService(name) {
  services.delete(name);
}

export default {
  registerService,
  getService,
  hasService,
  listServices,
  removeService
};
