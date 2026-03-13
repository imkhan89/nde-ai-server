const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname,"../data/query_learning.json")

let memory = {}

try{

if(fs.existsSync(filePath)){
memory = JSON.parse(fs.readFileSync(filePath,"utf8"))
}

}catch(err){

console.log("Learning memory load error:",err.message)

}

function learn(query){

query = query.toLowerCase()

if(!memory[query]){
memory[query] = 0
}

memory[query]++

save()

}

function save(){

try{

fs.writeFileSync(filePath,JSON.stringify(memory,null,2))

}catch(err){

console.log("Learning save error:",err.message)

}

}

function getPopularQueries(){

const sorted = Object.entries(memory)
.sort((a,b)=>b[1]-a[1])
.slice(0,10)

return sorted.map(q=>q[0])

}

module.exports = {
learn,
getPopularQueries
}
