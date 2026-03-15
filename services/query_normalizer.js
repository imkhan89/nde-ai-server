export function normalizeQuery(text) {

  if (!text) return ""

  let q = text.toLowerCase()

  q = q.replace(/[^a-z0-9\s]/g, " ")

  q = q.replace(/\s+/g, " ").trim()

  const replacements = {
    corolla: "toyota corolla",
    civic: "honda civic",
    city: "honda city",
    gli: "corolla gli",
    altis: "corolla altis",
    grande: "corolla grande",
    reborn: "honda civic reborn",
    rebirth: "honda civic rebirth"
  }

  Object.keys(replacements).forEach(key => {
    if (q.includes(key)) {
      q = q.replace(key, replacements[key])
    }
  })

  return q
}
