import { processUserMessage } from "./ai_engine.js"

export async function routeChat(message) {

  const reply = await processUserMessage(message)

  return reply

}
