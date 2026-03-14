export function adminRoutes(app,db){

app.get("/stats",async(req,res)=>{

const customers = await db.get("SELECT COUNT(*) as c FROM customers")
const leads = await db.get("SELECT COUNT(*) as c FROM leads")

res.json({
customers:customers.c,
leads:leads.c
})

})

}
