const Expense = require("../models/Expense");
const Category = require("../models/Category");
const ErrorResponse = require("../utils/errorResponse");

exports.postExpense = async (req, res, next) => {
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

exports.getExpenses = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Expense.countDocuments({ user: req.user._id });

    const expenses = await Expense.find({ user: req.user._id })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: "category",
        select: "categoryName description",
      });

    // Pagination result
    const pagination = {};

    if (total > 0) pagination.total = Math.ceil(total / limit);
    if (page) pagination.current = page;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: expenses.length,
      pagination,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return next(new ErrorResponse("Resource not found", 404));
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

exports.postEditExpense = async (req, res, next) => {
  const { expenseId } = req.params;

  try {
    const { statement, category, newCategoryName, amount, subExpense } =
      req.body;

    // Required Fields
    const enteredData = {
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

    const expense = await Expense.findByIdAndUpdate(expenseId, enteredData, {
      new: true,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
      return next(new ErrorResponse("Resource not found", 404));
    }
    res
      .status(200)
      .json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    next(error);
  }
};
