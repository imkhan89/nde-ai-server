require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")

const { mainMenu, processAutoParts } = require("./conversation_engine")
const { generateTicket } = require("./complaint_ticket_engine")
const { handleKnowledge } = require("./knowledge_engine")

const sessionManager = require("./sessions/sessionManager")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

/* =====================================================
SESSION CONFIG
===================================================== */

const SESSION_TIMEOUT = 60 * 60 * 1000

/* =====================================================
WHATSAPP WEBHOOK
===================================================== */

app.post("/whatsapp", async (req, res) => {

const message = (req.body.Body || "").trim()
const from = req.body.From || ""

let session = sessionManager.getSession(from)

if (!session) {

session = sessionManager.createSession(from)

}

if (Date.now() - session.lastActivity > SESSION_TIMEOUT) {

sessionManager.resetSession(from)
session = sessionManager.createSession(from)

}

session.lastActivity = Date.now()

/* =====================================================
RETURN TO MAIN MENU
===================================================== */

if (message === "#") {

session.state = "MENU"

return res.send(mainMenu())

}

/* =====================================================
STATE MACHINE
===================================================== */

if (!session.state) {

session.state = "MENU"
return res.send(mainMenu())

}

/* =====================================================
MAIN MENU
===================================================== */

if (session.state === "MENU") {

if (message === "1") {

session.state = "AUTO_PARTS"

return res.send(
`Share the following details

Vehicle Make
Model Name
Model Year
Part Required

Example
Honda Civic 2018 Brake Pad

# TO RETURN TO MAIN MENU`
)

}

if (message === "2") {

session.state = "ACCESSORIES"

return res.send(
`Please share

Vehicle Make
Model Name
Model Year
Accessory Required

Example
Toyota Revo 2021 Floor Mats

# TO RETURN TO MAIN MENU`
)

}

if (message === "3") {

return res.send(
`Browse Stickers

https://www.ndestore.com/collections/stickers-decal

# TO RETURN TO MAIN MENU`
)

}

if (message === "4") {

session.state = "ORDER_STATUS"

return res.send(
`Please share your Order Number

Example
ND12345

# TO RETURN TO MAIN MENU`
)

}

if (message === "5") {

session.state = "CHAT_SUPPORT"

return res.send(
`How can we assist you today?

You may ask about auto parts, accessories, or decals.

# TO RETURN TO MAIN MENU`
)

}

if (message === "6") {

session.state = "COMPLAINT"

return res.send(
`We regret the inconvenience caused.

Kindly share the following information so our representative can assist you promptly.

Order Number:
Details of the Issue:

# TO RETURN TO MAIN MENU`
)

}

return res.send(mainMenu())

}

/* =====================================================
AUTO PARTS SEARCH
===================================================== */

if (session.state === "AUTO_PARTS") {

const result = processAutoParts(message)

return res.send(
`Vehicle Detected

Make: ${result.analysis.make}
Model: ${result.analysis.model}
Year Range: ${result.analysis.generation}
Part: ${result.analysis.part}

Search Results
${result.url}

# TO RETURN TO MAIN MENU`
)

}

/* =====================================================
ACCESSORIES SEARCH
===================================================== */

if (session.state === "ACCESSORIES") {

const result = processAutoParts(message)

return res.send(
`Search Results

${result.url}

# TO RETURN TO MAIN MENU`
)

}

/* =====================================================
ORDER STATUS
===================================================== */

if (session.state === "ORDER_STATUS") {

return res.send(
`Checking order status...

Please visit

https://www.ndestore.com

# TO RETURN TO MAIN MENU`
)

}

/* =====================================================
CHAT SUPPORT
===================================================== */

if (session.state === "CHAT_SUPPORT") {

const knowledge = handleKnowledge(message)

if (knowledge) {

return res.send(
`${knowledge}

# TO RETURN TO MAIN MENU`
)

}

return res.send(
`Our representative will assist you shortly.

WhatsApp
+92 323 4954117

# TO RETURN TO MAIN MENU`
)

}

/* =====================================================
COMPLAINT SYSTEM
===================================================== */

if (session.state === "COMPLAINT") {

const lines = message.split("\n")

const orderNumber = lines[0] || "UNKNOWN"

const ticket = generateTicket(orderNumber)

return res.send(
`Complaint Registered

Ticket Number: ${ticket}

Our representative will contact you shortly.

WhatsApp
+92 323 4954117

# TO RETURN TO MAIN MENU`
)

}

return res.send(mainMenu())

})

/* =====================================================
SERVER START
===================================================== */

app.get("/", (req, res) => {

res.send("NDE AI Server Running")

})

app.listen(PORT, () => {

console.log("Server running on port", PORT)

})
