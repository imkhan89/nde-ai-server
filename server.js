import 'dotenv/config'
import app from "./server/http_server.js"

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`ndestore.com Automotive AI running on port ${PORT}`)
})
