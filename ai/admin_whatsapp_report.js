const express = require("express")
const reportEngine = require("./admin_report_engine")

const router = express.Router()

router.get("/admin/report",(req,res)=>{

const report = reportEngine.buildReport()

res.send(report)

})

module.exports = router
