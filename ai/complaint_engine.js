const fs = require("fs")
const path = require("path")

const FILE = path.join(__dirname,"../data/complaints.json")

function load(){

if(!fs.existsSync(FILE)){
fs.writeFileSync(FILE,"[]")
}

try{
return JSON.parse(fs.readFileSync(FILE,"utf8"))
}catch(e){
return []
}

}

function save(data){

fs.writeFileSync(FILE,JSON.stringify(data,null,2))

}

function isComplaint(text){

const t = text.toLowerCase()

const keywords = [
"complaint",
"problem",
"bad service",
"refund",
"return",
"not working",
"wrong item",
"damage",
"fraud",
"fake"
]

return keywords.some(k => t.includes(k))

}

function saveComplaint(phone,message){

const db = load()

db.push({
phone,
message,
time:new Date().toISOString()
})

save(db)

}

module.exports = {
isComplaint,
saveComplaint
}
