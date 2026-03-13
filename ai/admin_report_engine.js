const fs = require("fs")
const path = require("path")

const behaviorFile = path.join(__dirname,"../data/customer_behavior.json")
const complaintsFile = path.join(__dirname,"../data/complaints.json")

function loadBehavior(){

if(!fs.existsSync(behaviorFile)){
return {}
}

try{
return JSON.parse(fs.readFileSync(behaviorFile,"utf8"))
}catch(e){
return {}
}

}

function loadComplaints(){

if(!fs.existsSync(complaintsFile)){
return []
}

try{
return JSON.parse(fs.readFileSync(complaintsFile,"utf8"))
}catch(e){
return []
}

}

function buildReport(){

const behavior = loadBehavior()
const complaints = loadComplaints()

let report = ""

report += "NDESTORE AI DAILY REPORT\n\n"

/* DAILY CHATS */

if(behavior.dailyChats){

report += "Daily Chats:\n"

Object.keys(behavior.dailyChats).forEach(date=>{

report += `${date} : ${behavior.dailyChats[date]} chats\n`

})

report += "\n"

}

/* PRODUCT DEMAND */

if(behavior.productDemand){

report += "Products In Demand:\n"

const sorted = Object.entries(behavior.productDemand)
.sort((a,b)=>b[1]-a[1])
.slice(0,10)

sorted.forEach(p=>{

report += `${p[0]} : ${p[1]} searches\n`

})

report += "\n"

}

/* CUSTOMER ACTIVITY */

if(behavior.customers){

report += `Active Customers: ${Object.keys(behavior.customers).length}\n\n`

}

/* COMPLAINTS */

report += `Total Complaints: ${complaints.length}\n`

return report

}

module.exports = {
buildReport
}
