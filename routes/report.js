const { Router } = require("express");
const { getExpensesByRange } = require("../controllers/report");
const { protect } = require("../middleware/protect");
const router = Router();

router.get("/", protect, getExpensesByRange);

module.exports = router;
