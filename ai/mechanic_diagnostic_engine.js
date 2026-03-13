const fs = require("fs")
const path = require("path")

const DIAGNOSTIC_DB_PATH =
path.join(__dirname,"../data/diagnostic_database.json")

let diagnosticDB = []

function loadDiagnosticDatabase(){

try{

if(!fs.existsSync(DIAGNOSTIC_DB_PATH)){

console.log("Diagnostic database not found")

diagnosticDB = []

return

}

const raw = fs.readFileSync(DIAGNOSTIC_DB_PATH)

diagnosticDB = JSON.parse(raw)

console.log("Mechanic diagnostic database loaded")

}catch(err){

console.log("Diagnostic DB load error:",err.message)

diagnosticDB = []

}

}

function normalize(text){

if(!text) return ""

return text.toLowerCase().trim()

}

function detectProblem(message){

const msg = normalize(message)

let matches = []

for(let item of diagnosticDB){

for(let keyword of item.keywords){

if(msg.includes(normalize(keyword))){

matches.push(item)

break

}

}

}

return matches

}

function buildDiagnosticResponse(message){

const issues = detectProblem(message)

if(!issues.length){

return null

}

let response = "Possible Issue Detected\n\n"

issues.slice(0,3).forEach((issue,index)=>{

response += (index+1)+". "+issue.problem+"\n"

if(issue.parts && issue.parts.length){

response += "Recommended Parts:\n"

issue.parts.forEach(p=>{

response += "• "+p+"\n"

})

}

response += "\n"

})

return response

}

module.exports = {

loadDiagnosticDatabase,
buildDiagnosticResponse

}
