const fs = require("fs")
const path = require("path")

const FORWARD_FILE = path.join(__dirname,"../data/live_agent_queue.json")

function load(){

if(!fs.existsSync(FORWARD_FILE)){
fs.writeFileSync(FORWARD_FILE,"[]")
}

try{
return JSON.parse(fs.readFileSync(FORWARD_FILE,"utf8"))
}catch(e){
return []
}

}

function save(data){

fs.writeFileSync(FORWARD_FILE,JSON.stringify(data,null,2))

}

function forwardToAgent(phone,message){

const db = load()

db.push({
phone:phone,
message:message,
time:new Date().toISOString(),
status:"pending"
})

save(db)

}

module.exports = {
forwardToAgent
}
