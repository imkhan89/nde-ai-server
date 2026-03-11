/* =====================================================
AUTOMOTIVE POSITION DETECTION ENGINE
Detects front / rear / left / right positions
===================================================== */

const POSITION_KEYWORDS = {

front:[
"front",
"front side",
"front left",
"front right",
"fr"
],

rear:[
"rear",
"back",
"rear side",
"rear left",
"rear right",
"rr"
],

left:[
"left",
"lh",
"left hand",
"driver side"
],

right:[
"right",
"rh",
"right hand",
"passenger side"
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

const parts = keyword.split(" ")

if(parts.length === 1){

if(words.includes(parts[0])){
return pos
}

}else{

if(query.includes(keyword)){
return pos
}

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
