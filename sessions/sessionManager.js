const fs = require("fs")
const axios = require("axios")

const SESSION_TIMEOUT = 1 * 60 * 1000
  const ADMIN_WHATSAPP = "923214222294"

const sessions = {}
let sessionCounter = 1


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

}

}


// Create Session
function createSession(phone){

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

// Send customer message
await sendWhatsApp(phone,
"Session ended. Thank you for contacting ndestore.com 🚗"
)


// Prepare admin report
const report = {

sessionId:session.sessionId,
phone:phone,
logs:session.logs,
errors:session.errors,
endedAt:new Date().toISOString()

}


// Save to file
fs.appendFileSync(
"./session_history.log",
JSON.stringify(report,null,2)+"\n"
)


// Send report to admin WhatsApp
await sendWhatsApp(
ADMIN_WHATSAPP,
`Session ${session.sessionId} ended\nCustomer: ${phone}\nLogs: ${session.logs.length}\nErrors: ${session.errors.length}`
)

}catch(err){

console.error("Session End Error:",err.message)

}


// Delete session
delete sessions[phone]

}



// Expiry Worker
setInterval(()=>{

const now = Date.now()

for(const phone in sessions){

const session = sessions[phone]

if(now - session.lastMessage > SESSION_TIMEOUT){

endSession(phone)

}

}

},60000)   // Check every 60 seconds



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
