import { classifyMessage } from "./message_classifier.js"

export function detectIntent(message) {

  const intent = classifyMessage(message)

  return intent

}
