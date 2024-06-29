const { Router } = require("express");
const {
  postExpense,
  getExpenses,
  getExpense,
  putEditExpense,
  deleteExpense,
} = require("../controllers/expense");
const { protect } = require("../middleware/protect");
const router = Router();

router.post("/", protect, postExpense);
router.get("/", protect, getExpenses);
router.get("/:expenseId", protect, getExpense);
router.put("/:expenseId", protect, putEditExpense);
router.delete("/:expenseId", protect, deleteExpense);

module.exports = router;
