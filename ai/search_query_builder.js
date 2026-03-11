/* =====================================================
SEARCH QUERY BUILDER
===================================================== */

function buildSearchQuery(data){

let parts = []

if(data.part){

parts.push(data.part)

}

if(data.position){

parts.push(data.position)

}

if(data.make){

parts.push(data.make)

}

if(data.model){

parts.push(data.model)

}

if(data.year){

parts.push(data.year)

}

return parts.join(" ").trim()

}


module.exports = {

buildSearchQuery

}
