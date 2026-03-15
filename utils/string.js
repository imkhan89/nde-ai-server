export function clean(text) {

  if (!text) return ""

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ")
    .trim()

}
