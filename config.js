import dotenv from "dotenv"

dotenv.config()

export default {
TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
TWILIO_NUMBER: process.env.TWILIO_NUMBER,

SHOPIFY_STORE: process.env.SHOPIFY_STORE,
SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,

ADMIN_PORT: process.env.ADMIN_PORT || 4000,
SERVER_PORT: process.env.SERVER_PORT || 3000
}
