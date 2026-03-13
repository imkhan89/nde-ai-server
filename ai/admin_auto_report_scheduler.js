const reportEngine = require("./admin_report_engine")
const fs = require("fs")
const path = require("path")

const REPORT_FILE = path.join(__dirname,"../data/daily_ai_reports.log")

function saveReport(report){

const time = new Date().toISOString()

const entry = `\n\n==== ${time} ====\n${report}\n`

fs.appendFileSync(REPORT_FILE,entry)

}

function runDailyReport(){

try{

const report = reportEngine.buildReport()

saveReport(report)

console.log("AI daily report generated")

}catch(err){

console.log("Report generation failed:",err.message)

}

}

function startScheduler(){

setInterval(()=>{

runDailyReport()

},86400000)

}

module.exports = {
startScheduler
}
