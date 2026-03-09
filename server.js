require("dotenv").config()

const express=require("express")
const bodyParser=require("body-parser")

const sessionManager=require("./sessions/sessionManager")

const {

mainMenu,
processAutoParts,
processAccessories,
processDecals,
processOrderStatus,
processChatSupport,
processComplaint

}=require("./conversation_engine")

const { escalate } = require("./escalation_engine")

const app=express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const PORT=process.env.PORT || 3000

const SESSION_TIMEOUT=60*60*1000

app.post("/whatsapp",async(req,res)=>{

const message=(req.body.Body || "").trim()
const phone=req.body.From || ""

let session=sessionManager.getSession(phone)

if(!session){
session=sessionManager.createSession(phone)
}

if(Date.now()-session.lastActivity > SESSION_TIMEOUT){

sessionManager.resetSession(phone)
session=sessionManager.createSession(phone)

}

session.lastActivity=Date.now()

if(message==="#"){

session.state="MENU"
return res.send(mainMenu())

}

if(!session.state){

session.state="MENU"
return res.send(mainMenu())

}

/* MENU */

if(session.state==="MENU"){

if(message==="1"){

session.state="AUTO_PARTS"

return res.send(`Share vehicle and part details

Example
Honda Civic 2018 Brake Pad

# TO RETURN TO MAIN MENU`)

}

if(message==="2"){

session.state="ACCESSORIES"

return res.send(`Share accessory details

Example
Toyota Revo Floor Mats

# TO RETURN TO MAIN MENU`)

}

if(message==="3"){

return res.send(processDecals())

}

if(message==="4"){

session.state="ORDER_STATUS"

return res.send(`Please share your order number

Example
ND12345

# TO RETURN TO MAIN MENU`)

}

if(message==="5"){

session.state="CHAT_SUPPORT"

return res.send(`How can we assist you today?

# TO RETURN TO MAIN MENU`)

}

if(message==="6"){

session.state="COMPLAINT"

return res.send(`We regret the inconvenience caused.

Kindly share

Order Number
Details

# TO RETURN TO MAIN MENU`)

}

return res.send(mainMenu())

}

/* AUTO PARTS */

if(session.state==="AUTO_PARTS"){

const response=await processAutoParts(message)
return res.send(response)

}

/* ACCESSORIES */

if(session.state==="ACCESSORIES"){

const response=await processAccessories(message)
return res.send(response)

}

/* ORDER */

if(session.state==="ORDER_STATUS"){

return res.send(processOrderStatus(message))

}

/* CHAT */

if(session.state==="CHAT_SUPPORT"){

return res.send(processChatSupport(message))

}

/* COMPLAINT */

if(session.state==="COMPLAINT"){

return res.send(processComplaint(message))

}

return res.send(escalate())

})

app.get("/",(req,res)=>{

res.send("NDE AI Server Running")

})

app.listen(PORT,()=>{

console.log("Server running on port",PORT)

})
