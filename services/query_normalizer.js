import { spellingDictionary } from "../data/spelling_dictionary.js"

export function normalizeQuery(message) {

  const words = message.toLowerCase().split(" ")

  const corrected = words.map(word => {

    if (spellingDictionary[word]) {
      return spellingDictionary[word]
    }

    return word

  })

  return corrected.join(" ")

}
