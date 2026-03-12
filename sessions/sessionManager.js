const fs = require("fs");
const path = require("path");

const SESSION_FILE = path.join(__dirname, "sessions.json");

let sessions = {};

/* LOAD SESSIONS */

function loadSessions(){

try{

if(fs.existsSync(SESSION_FILE)){

const raw = fs.readFileSync(SESSION_FILE,"utf8");

sessions = JSON.parse(raw || "{}");

}

}catch(e){

console.log("Session load error:",e.message);

sessions = {};

}

}

loadSessions();

/* SAVE SESSIONS */

function saveSessions(){

try{

fs.writeFileSync(SESSION_FILE,JSON.stringify(sessions,null,2));

}catch(e){

console.log("Session save error:",e.message);

}

}

/* GET SESSION */

function getSession(phone){

return sessions[phone] || null;

}

/* CREATE SESSION */

function createSession(phone,state){

sessions[phone] = {

state:state,
lastActive:Date.now()

};

saveSessions();

return sessions[phone];

}

/* UPDATE SESSION */

function updateSession(phone,state){

if(!sessions[phone]){

createSession(phone,state);

return;

}

sessions[phone].state = state;
sessions[phone].lastActive = Date.now();

saveSessions();

}

/* EXPORT */

module.exports = {

getSession,
createSession,
updateSession

};
