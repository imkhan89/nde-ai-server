import express from "express"
import { initDB } from "./database/database.js"
import { adminRoutes } from "./routes/admin.js"
import config from "./config.js"

const app = express()

const db = await initDB()

adminRoutes(app,db)

app.listen(config.ADMIN_PORT,()=>{
console.log("Admin server running")
})
