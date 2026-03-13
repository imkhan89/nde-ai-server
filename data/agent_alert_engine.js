const fs = require("fs")
const path = require("path")

const queueFile = path.join(__dirname,"../data/live_agent_queue.json")
const alertFile = path.join(__dirname,"../data/agent_alerts.log")

function loadQueue(){

if(!fs.existsSync(queueFile)){
fs.writeFileSync(queueFile,"[]")
}

try{
return JSON.parse(fs.readFileSync(queueFile,"utf8"))
}catch(e){
return []
}

}

function saveQueue(data){

fs.writeFileSync(queueFile,JSON.stringify(data,null,2))

}

function appendAlert(text){

fs.appendFileSync(alertFile,text+"\n")

}

function processQueue(){

const queue = loadQueue()

let updated = false

queue.forEach(item=>{

if(item.status === "pending"){

const msg = `
NEW CUSTOMER SUPPORT REQUEST

Customer: ${item.phone}
Message: ${item.message}
Time: ${item.time}

Forward to Agent:
WhatsApp +92 308 7643288
`

appendAlert(msg)

item.status = "processed"

updated = true

}

})

if(updated){
saveQueue(queue)
}

}

function startAgentAlertEngine(){

setInterval(()=>{

processQueue()

},30000)

}

module.exports = {
startAgentAlertEngine
}
