/* =====================================================
AUTOMOTIVE POSITION DETECTION ENGINE
Detects front / rear / left / right positions
===================================================== */

const POSITION_KEYWORDS = {

front:[
"front",
"fr",
"front side"
],

rear:[
"rear",
"back",
"rear side"
],

left:[
"left",
"lh",
"left hand"
],

right:[
"right",
"rh",
"right hand"
]

}


/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}


/* =====================================================
DETECT POSITION
===================================================== */

function detectPosition(text){

const query = normalize(text)

const words = query.split(" ")

for(const pos in POSITION_KEYWORDS){

for(const keyword of POSITION_KEYWORDS[pos]){

if(words.includes(keyword)){
return pos
}

}

}

return null

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {
detectPosition
}
