const { Router } = require("express");
const {
  postExpense,
  getExpenses,
  putEditExpense,
  deleteExpense,
} = require("../controllers/expense");
const { protect } = require("../middleware/protect");
const router = Router();

router.post("/", protect, postExpense);
router.get("/", protect, getExpenses);
router.put("/:expenseId", protect, putEditExpense);
router.delete("/:expenseId", protect, deleteExpense);

module.exports = router;
