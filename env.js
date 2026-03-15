import dotenv from "dotenv"

export function loadEnv() {

  dotenv.config()

  return {
    PORT: process.env.PORT || 3000,
    SHOPIFY_STORE: process.env.SHOPIFY_STORE || "",
    SHOPIFY_ADMIN_TOKEN: process.env.SHOPIFY_ADMIN_TOKEN || ""
  }

}
