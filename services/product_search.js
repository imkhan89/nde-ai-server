import db from "../database/database.js"

export function searchProducts(query) {

  return new Promise((resolve, reject) => {

    const sql = `
      SELECT title, handle
      FROM products
      WHERE title LIKE ?
      LIMIT 5
    `

    db.all(sql, [`%${query}%`], (err, rows) => {

      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }

    })

  })

}
