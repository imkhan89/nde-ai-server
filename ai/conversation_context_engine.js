const fs = require("fs")
const path = require("path")

const contextFile = path.join(__dirname,"../data/conversation_context.json")

function ensureFile(){

if(!fs.existsSync(contextFile)){
fs.writeFileSync(contextFile,"{}")
}

}

function loadContext(){

ensureFile()

try{

const raw = fs.readFileSync(contextFile,"utf8")

return JSON.parse(raw)

}catch(err){

return {}

}

}

function saveContext(data){

fs.writeFileSync(contextFile,JSON.stringify(data,null,2))

}

function setContext(phone,data){

const context = loadContext()

context[phone] = {
...context[phone],
...data,
updated:new Date().toISOString()
}

saveContext(context)

}

function getContext(phone){

const context = loadContext()

if(context[phone]){
return context[phone]
}

return null

}

function clearContext(phone){

const context = loadContext()

if(context[phone]){
delete context[phone]
saveContext(context)
}

}

module.exports = {
setContext,
getContext,
clearContext
}
