const fs = require("fs")
const path = require("path")

const testLog = path.join(__dirname,"../data/test_messages.log")

function logTest(message,phone){

const time = new Date().toISOString()

const entry = `
TIME: ${time}
PHONE: ${phone}
MESSAGE: ${message}
---------------------------
`

fs.appendFileSync(testLog,entry)

}

module.exports = {
logTest
}
