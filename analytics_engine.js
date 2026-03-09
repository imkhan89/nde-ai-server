/* =====================================================
AI ANALYTICS ENGINE
===================================================== */

const fs=require("fs")
const path=require("path")

const LOG_FILE=path.join(__dirname,"logs","search_analytics.json")

function logSearch(data){

let logs=[]

try{

logs=JSON.parse(fs.readFileSync(LOG_FILE))

}catch(e){

logs=[]

}

logs.push({

query:data.query,
vehicle:data.vehicle,
part:data.part,
time:new Date().toISOString()

})

fs.writeFileSync(LOG_FILE,JSON.stringify(logs,null,2))

}

module.exports={logSearch}
