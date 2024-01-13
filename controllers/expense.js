const Expense = require("../models/Expense");
const Category = require("../models/Category");
const ErrorResponse = require("../utils/errorResponse");

exports.addExpense = async (req, res, next) => {
  try {
    const { statement, category, newCategoryName, amount, subExpense } =
      req.body;

    // Required Fields
    const enteredData = {
      user: req.user._id,
      statement,
      amount,
    };

    if (newCategoryName) {
      // Create category and get id
      const response = await Category.create({
        categoryName: newCategoryName,
        user: req.user._id,
      });
      enteredData.category = response._id;
    } else enteredData.category = category;

    // Optional Field
    if (subExpense) enteredData.subExpense = subExpense;

    const expense = await Expense.create(enteredData);

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// exports.modifyExpense = async (req, res, next) => { };

// exports.deleteExpense = async (req, res, next) => {
//   try {
//     const { expenseId } = req.params;
//     const expense = await Expense.findByIdAndDelete(expenseId);
//     if (!expense) {
//       return res
//         .status(404)
//         .json({ success: true, message: "Resource not found" });
//     }
//     res
//       .status(200)
//       .json({ success: true, message: "Resource deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// exports.getExpense = async (req, res, next) => {
//   try {
//     const { expenseId } = req.params;
//     const expense = await Expense.findById(expenseId);
//     if (!expense) {
//       return res
//         .status(404)
//         .json({ success: true, message: "Resource not found" });
//     }
//     res.status(200).json({ success: true, data: expense });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// exports.getExpenses = async (req, res, next) => {
//   try {
//     const expenses = await Expense.find({ user: req.user._id });
//     res
//       .status(200)
//       .json({ success: true, count: expenses.length, data: expenses });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
