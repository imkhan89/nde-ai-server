import dotenv from "dotenv"
import createHttpServer from "./server/http_server.js"
import { syncShopifyProducts } from "./sync/shopify_sync.js"

dotenv.config()

const PORT = process.env.PORT || 3000

async function startServer() {

  try {

    const server = createHttpServer()

    server.listen(PORT, () => {
      console.log(`NDE AI Server running on port ${PORT}`)
    })

    await syncShopifyProducts()

    setInterval(async () => {
      await syncShopifyProducts()
    }, 1000 * 60 * 30)

  } catch (error) {

    console.error("Server start error:", error)

  }

}

startServer()
