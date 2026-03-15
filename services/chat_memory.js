let MEMORY = {}

export function saveMessage(user, message) {

  if (!MEMORY[user]) {
    MEMORY[user] = []
  }

  MEMORY[user].push(message)

}

export function getConversation(user) {

  return MEMORY[user] || []

}
