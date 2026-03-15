/*
NDE Automotive AI
Environment Validator
*/

const REQUIRED_ENV = [
  "SHOPIFY_STORE",
  "SHOPIFY_TOKEN"
];

export function validateEnvironment() {

  const missing = [];

  for (const key of REQUIRED_ENV) {

    if (!process.env[key]) {

      missing.push(key);

    }

  }

  if (missing.length > 0) {

    console.warn("Missing environment variables:", missing.join(", "));

    return {
      valid: false,
      missing
    };

  }

  return {
    valid: true,
    missing: []
  };

}
