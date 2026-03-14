export async function getContext(db, phone){

const row = await db.get(
"SELECT vehicle,part FROM conversation_context WHERE phone=?",
[phone]
)

if(!row){
return {}
}

return row
}

export async function setContext(db, phone, data){

const existing = await db.get(
"SELECT * FROM conversation_context WHERE phone=?",
[phone]
)

if(!existing){

await db.run(
"INSERT INTO conversation_context(phone,vehicle,part) VALUES(?,?,?)",
[
phone,
data.vehicle || null,
data.part || null
]
)

}else{

await db.run(
`UPDATE conversation_context
SET vehicle = COALESCE(?,vehicle),
part = COALESCE(?,part)
WHERE phone=?`,
[
data.vehicle || null,
data.part || null,
phone
]
)

}

}
