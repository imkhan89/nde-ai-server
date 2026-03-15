export function unique(arr) {

  return [...new Set(arr)]

}

export function first(arr) {

  if (!arr) return null

  return arr[0]

}
