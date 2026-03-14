import db from "../database/database.js"

export function searchProducts(part) {

  return new Promise((resolve, reject) => {

    const query = `
      SELECT title, handle
      FROM products
      WHERE title LIKE ?
      LIMIT 5
    `

    db.all(query, [`%${part}%`], (err, rows) => {

      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }

    })

  })

}
