import express from "express";
import { getAllChats,getChatSummary,getChat } from "../services/chat_memory.js";

const router = express.Router();

router.get("/dashboard/chats",(req,res)=>{

res.json(getChatSummary());

});

router.get("/dashboard/chat/:phone",(req,res)=>{

const phone = req.params.phone;

res.json(getChat(phone));

});

export default router;
