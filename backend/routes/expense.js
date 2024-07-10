const { Router } = require("express");
const {
  postExpense,
  getExpenses,
  putEditExpense,
  deleteExpense,
  downloadCsv,
} = require("../controllers/expense");
const { protect } = require("../middleware/protect");
const router = Router();

router.post("/", protect, postExpense);
router.get("/", protect, getExpenses);
router.put("/:expenseId", protect, putEditExpense);
router.delete("/:expenseId", protect, deleteExpense);
router.get("/export", protect, downloadCsv);

module.exports = router;
