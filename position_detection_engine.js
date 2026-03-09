/* =====================================================
AUTOMOTIVE POSITION DETECTION ENGINE
Detects front/rear/left/right positions
===================================================== */

const POSITION_KEYWORDS = {

front:[
"front",
"fr",
"f"
],

rear:[
"rear",
"back",
"rr",
"r"
],

left:[
"left",
"lh"
],

right:[
"right",
"rh"
]

}

/* =====================================================
DETECT POSITION
===================================================== */

function detectPosition(text){

const query = (text || "").toLowerCase()

for(const pos in POSITION_KEYWORDS){

for(const keyword of POSITION_KEYWORDS[pos]){

if(query.includes(keyword)){
return pos
}

}

}

return null

}

module.exports = {
detectPosition
}
