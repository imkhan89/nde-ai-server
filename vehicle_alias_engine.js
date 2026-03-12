const aliases = {

corolla:["gli","altis"],
civic:["reborn","rebirth","x","xi"],
cultus:["new cultus"],
alto:["alto 660"],
city:["city aspire"]

}

function detectAlias(query){

if(!query || typeof query !== "string"){
return null
}

const q = query.toLowerCase()

for(const model in aliases){

const list = aliases[model]

for(const alias of list){

if(q.includes(alias)){

return {
brand:"",
model:model,
variant:"",
years:[]
}

}

}

}

return null

}

module.exports = detectAlias
