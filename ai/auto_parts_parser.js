/*
AUTO PARTS INTELLIGENT PARSER
ndestore AI Automotive Engine
*/

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[,+]/g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* CAPITALIZE WORDS */

function capitalize(text){

if(!text) return ""

return text
.split(" ")
.map(w => w.charAt(0).toUpperCase() + w.slice(1))
.join(" ")

}

/* DETECT YEAR */

function detectYear(tokens){

for(const t of tokens){

if(/^(19|20)\d{2}$/.test(t)){
return t
}

}

return ""

}

/* EXTRACT PART / MAKE / MODEL */

function extract(tokens,year){

const words = tokens.filter(t => t !== year)

let part = ""
let make = ""
let model = ""

if(words.length >= 3){

part = words.slice(0,words.length-2).join(" ")
make = words[words.length-2]
model = words[words.length-1]

}

else if(words.length === 2){

part = words[0]
make = words[1]

}

return {part,make,model}

}

/* VEHICLE YEAR RANGE DETECTION */

function detectYearRange(year){

if(!year) return ""

const y = parseInt(year)

/*
Common Pakistan vehicle ranges
Expand as database grows
*/

const ranges = [

{start:2021,end:2026},
{start:2017,end:2021},
{start:2012,end:2017},
{start:2008,end:2012},
{start:2003,end:2008}

]

for(const r of ranges){

if(y >= r.start && y <= r.end){

return `${r.start}-${r.end}`

}

}

return year

}

/* BUILD SHOPIFY SEARCH QUERY */

function buildQuery(part,make,model,year){

if(year){

return `${part} for ${make} ${model} ${year}`

}

return `${part} for ${make} ${model}`

}

/* BUILD SEARCH URL */

function buildURL(query){

return "https://www.ndestore.com/search?q=" +
encodeURIComponent(query)

}

/* MAIN PARSER */

function parseAutoParts(message){

if(!message) return null

const clean = normalize(message)

const tokens = clean.split(" ")

if(tokens.length < 2){
return null
}

const year = detectYear(tokens)

const {part,make,model} = extract(tokens,year)

if(!part || !make){
return null
}

const yearRange = detectYearRange(year)

const query = buildQuery(part,make,model,yearRange)

const url = buildURL(query)

return {

part: capitalize(part),
make: capitalize(make),
model: capitalize(model),
year: year || "",
yearRange: yearRange || "",
query: query,
url: url

}

}

module.exports = parseAutoParts
