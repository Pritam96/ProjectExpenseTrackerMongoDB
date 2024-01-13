const { Router } = require("express");
const { addExpense } = require("../controllers/expense");
const { protect } = require("../middleware/protect");
const router = Router();

router.post("/", protect, addExpense);

module.exports = router;
