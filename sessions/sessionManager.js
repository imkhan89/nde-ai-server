/* =====================================================
SESSION MANAGER
Stable session management for WhatsApp AI
===================================================== */

const sessions = {}

const SESSION_TIMEOUT = 6 * 60 * 60 * 1000


/* =====================================================
CREATE SESSION
===================================================== */

function createSession(phone){

const session = {

phone:phone,
state:"MENU",
lastActivity:Date.now()

}

sessions[phone] = session

return session

}


/* =====================================================
GET SESSION
===================================================== */

function getSession(phone){

return sessions[phone] || null

}


/* =====================================================
RESET SESSION
===================================================== */

function resetSession(phone){

delete sessions[phone]

}


/* =====================================================
UPDATE ACTIVITY
===================================================== */

function updateSession(phone){

if(sessions[phone]){

sessions[phone].lastActivity = Date.now()

}

}


/* =====================================================
SESSION CLEANUP
===================================================== */

setInterval(()=>{

const now = Date.now()

for(const phone in sessions){

const session = sessions[phone]

if(now - session.lastActivity > SESSION_TIMEOUT){

delete sessions[phone]

}

}

},60000)


/* =====================================================
EXPORT
===================================================== */

module.exports = {

createSession,
getSession,
resetSession,
updateSession

}
