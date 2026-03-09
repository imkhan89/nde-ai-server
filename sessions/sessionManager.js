const fs = require("fs")
const axios = require("axios")

const SESSION_TIMEOUT = 6 * 60 * 60 * 1000
const MAX_SESSIONS = 5000
const ADMIN_WHATSAPP = "923214222294"

const LOG_FILE = "./logs/session_history.log"
const ERROR_FILE = "./logs/errors.log"

const sessions = {}
let sessionCounter = 1


// Ensure log directory exists
function ensureLogs(){

if(!fs.existsSync("./logs")){
fs.mkdirSync("./logs")
}

if(!fs.existsSync(LOG_FILE)){
fs.writeFileSync(LOG_FILE,"")
}

if(!fs.existsSync(ERROR_FILE)){
fs.writeFileSync(ERROR_FILE,"")
}

}

ensureLogs()


// Generate Serial ID 000001 → 999999
function generateSessionId(){

let id = String(sessionCounter).padStart(6,"0")

sessionCounter++

if(sessionCounter > 999999){
sessionCounter = 1
}

return id

}


// Send WhatsApp message (Admin or Customer)
async function sendWhatsApp(phone,message){

try{

await axios.post("http://localhost:3000/send-message",{
phone,
message
})

}catch(err){

console.error("WhatsApp Send Error:",err.message)

fs.appendFileSync(
ERROR_FILE,
`${new Date().toISOString()} WhatsApp Send Error: ${err.message}\n`
)

}

}


// Create Session
function createSession(phone){

// Memory protection
if(Object.keys(sessions).length >= MAX_SESSIONS){

const oldest = Object.keys(sessions)[0]
delete sessions[oldest]

}

const id = generateSessionId()

sessions[phone] = {

sessionId:id,
active:true,
stage:"welcome_sent",
lastMessage:Date.now(),
logs:[],
errors:[]

}

logSession(phone,"Session Started")

}


// Update Last Activity
function updateSession(phone){

if(sessions[phone]){

sessions[phone].lastMessage = Date.now()

}

}


// Log Messages
function logSession(phone,message){

if(!sessions[phone]) return

sessions[phone].logs.push({
time:new Date().toISOString(),
message
})

}


// Log Errors
function logError(phone,error){

if(!sessions[phone]) return

sessions[phone].errors.push({
time:new Date().toISOString(),
error
})

fs.appendFileSync(
ERROR_FILE,
`${new Date().toISOString()} ${phone} ERROR: ${error}\n`
)

}


// Check if session exists
function sessionExists(phone){

return sessions[phone] !== undefined

}


// Get Session
function getSession(phone){

return sessions[phone]

}


// End Session
async function endSession(phone){

const session = sessions[phone]

if(!session) return

try{

// Send customer closing message
await sendWhatsApp(
phone,
"Session ended. Thank you for contacting ndestore.com 🚗"
)


// Prepare session report
const report = {

sessionId:session.sessionId,
phone:phone,
logs:session.logs,
errors:session.errors,
endedAt:new Date().toISOString()

}


// Save session history
fs.appendFileSync(
LOG_FILE,
JSON.stringify(report,null,2)+"\n"
)


// Send report to admin WhatsApp
await sendWhatsApp(
ADMIN_WHATSAPP,
`Session ${session.sessionId} ended
Customer: ${phone}
Logs: ${session.logs.length}
Errors: ${session.errors.length}`
)

}catch(err){

console.error("Session End Error:",err.message)

fs.appendFileSync(
ERROR_FILE,
`${new Date().toISOString()} Session End Error: ${err.message}\n`
)

}


// Delete session
delete sessions[phone]

}



// Expiry Worker
setInterval(()=>{

const now = Date.now()

console.log("Active Sessions:",Object.keys(sessions).length)

for(const phone in sessions){

const session = sessions[phone]

if(now - session.lastMessage > SESSION_TIMEOUT){

endSession(phone)

}

}

},60000) // Check every 60 seconds



// Reset Session Manually
function resetSession(phone){

if(sessions[phone]){

endSession(phone)

}

}


module.exports = {

sessionExists,
createSession,
updateSession,
resetSession,
getSession,
logSession,
logError

}
