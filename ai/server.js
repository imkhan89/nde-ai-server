/* =====================================================
CHAT SERVER
Receives messages and returns AI responses
===================================================== */

const express = require("express")

const bodyParser = require("body-parser")

const { handleCustomerMessage } = require("./chat_handler")

const app = express()

app.use(bodyParser.json())


/* =====================================================
CHAT ENDPOINT
===================================================== */

app.post("/chat", async (req,res)=>{

try{

const message = req.body.message || ""

const response = await handleCustomerMessage(message)

res.json({

reply: response

})

}catch(err){

res.json({

reply:"Server error. Please try again."

})

}

})


/* =====================================================
HEALTH CHECK
===================================================== */

app.get("/", (req,res)=>{

res.send("Automotive AI Server Running")

})


const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{

console.log("Server running on port " + PORT)

})
