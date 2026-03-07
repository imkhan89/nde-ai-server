/* =====================================================
AUTOMOTIVE AI LEARNING ENGINE
Learns From Customer Queries
===================================================== */

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname,"data","query_learning.json");

/* =====================================================
LOAD DATABASE
===================================================== */

function loadDB(){

try{

if(!fs.existsSync(DATA_FILE)){
fs.writeFileSync(DATA_FILE,JSON.stringify({queries:{}}));
}

const raw = fs.readFileSync(DATA_FILE);
return JSON.parse(raw);

}catch(e){

return {queries:{}};

}

}

/* =====================================================
SAVE DATABASE
===================================================== */

function saveDB(data){

fs.writeFileSync(DATA_FILE,JSON.stringify(data,null,2));

}

/* =====================================================
LEARN QUERY
===================================================== */

function learnQuery(query){

if(!query) return;

const db = loadDB();

query = query.toLowerCase().trim();

if(!db.queries[query]){
db.queries[query]=1;
}else{
db.queries[query]++;
}

saveDB(db);

}

/* =====================================================
POPULAR SEARCHES
===================================================== */

function getPopularQueries(limit=10){

const db = loadDB();

const list = Object.entries(db.queries)
.sort((a,b)=>b[1]-a[1])
.slice(0,limit);

return list;

}

module.exports={

learnQuery,
getPopularQueries

};
