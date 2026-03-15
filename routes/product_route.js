import express from "express"
import { getProducts } from "../services/product_cache.js"

const router = express.Router()

router.get("/", (req,res)=>{

  const products = getProducts()

  res.json({
    success:true,
    count:products.length,
    products
  })

})

export default router
