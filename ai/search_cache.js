/* =====================================================
SEARCH CACHE ENGINE
Caches search results for faster responses
===================================================== */

const CACHE = {}

const CACHE_TTL = 1000 * 60 * 10


function normalize(text){

if(!text) return ""

return text
.toString()
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}


function getCacheKey(query){

return normalize(query)

}


function getCachedResult(query){

const key = getCacheKey(query)

const record = CACHE[key]

if(!record) return null

const now = Date.now()

if(now > record.expire){

delete CACHE[key]

return null

}

return record.data

}


function setCachedResult(query, data){

const key = getCacheKey(query)

CACHE[key] = {

data:data,

expire:Date.now() + CACHE_TTL

}

}


function clearCache(){

for(const key in CACHE){

delete CACHE[key]

}

}


module.exports = {

getCachedResult,
setCachedResult,
clearCache

}
