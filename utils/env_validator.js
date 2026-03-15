const REQUIRED_ENV = [
  "SHOPIFY_STORE",
  "SHOPIFY_TOKEN"
];

export function validateEnv() {
  const missing = [];

  for (const key of REQUIRED_ENV) {
    if (!process.env[key] || process.env[key].trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error("Missing required environment variables:");
    for (const key of missing) {
      console.error(` - ${key}`);
    }
    process.exit(1);
  }

  return true;
}

export default {
  validateEnv
};
