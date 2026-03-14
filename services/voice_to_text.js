import axios from "axios"

export async function voiceToText(mediaUrl){

try{

const response = await axios.get(mediaUrl,{
responseType:"arraybuffer"
})

return "voice message received"

}catch(e){

return null

}

}
