/* =====================================================
AUTOMOTIVE PART POSITION INTELLIGENCE
Detects part positions used by customers
===================================================== */

const POSITION_ALIASES = {

front:[
"front",
"front side",
"front end"
],

rear:[
"rear",
"back",
"rear side",
"back side"
],

left:[
"left",
"left side",
"lhs",
"lh",
"driver side",
"driver side left"
],

right:[
"right",
"right side",
"rhs",
"rh",
"passenger side",
"passenger side right"
],

upper:[
"upper",
"top",
"top side"
],

lower:[
"lower",
"bottom",
"bottom side"
],

inner:[
"inner",
"inside"
],

outer:[
"outer",
"outside"
]

}


/* =====================================================
DETECT SINGLE POSITION
===================================================== */

function detectPartPosition(text){

text = text.toLowerCase()

for(const position in POSITION_ALIASES){

for(const alias of POSITION_ALIASES[position]){

if(text.includes(alias)){
return position
}

}

}

return null

}


/* =====================================================
DETECT MULTIPLE POSITIONS
(front + left etc)
===================================================== */

function detectAllPositions(text){

text = text.toLowerCase()

let results=[]

for(const position in POSITION_ALIASES){

for(const alias of POSITION_ALIASES[position]){

if(text.includes(alias)){
results.push(position)
break
}

}

}

return results

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {

detectPartPosition,
detectAllPositions

}
