const asyncHandler = require("express-async-handler");
const Expense = require("../models/Expense");
const Category = require("../models/Category");

exports.postExpense = asyncHandler(async (req, res, next) => {
  const { title, amount, category, description } = req.body;

  const enteredData = {
    user: req.user._id,
    title,
    amount,
    category,
    description: description || undefined,
  };

  const expense = await Expense.create(enteredData);
  const categoryDocument = await Category.findById(expense.category);

  res.status(201).json({
    _id: expense._id,
    title: expense.title,
    categoryId: expense.category,
    category: categoryDocument.title,
    amount: expense.amount,
    description: expense.description,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  });
});

exports.getExpenses = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 4;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Expense.countDocuments({ user: req.user._id });

  const expenses = await Expense.find({ user: req.user._id })
    .select("title amount category description createdAt updatedAt")
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: "category",
      select: "title",
    });

  const transformedExpenses = expenses.map((expense) => ({
    _id: expense._id,
    title: expense.title,
    categoryId: expense.category._id,
    category: expense.category.title,
    amount: expense.amount,
    description: expense.description,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  }));

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
    pagination,
    count: transformedExpenses.length,
    expenses: transformedExpenses,
  });
});

exports.getExpense = asyncHandler(async (req, res, next) => {
  const { expenseId } = req.params;
  const expense = await Expense.findById(expenseId)
    .populate({
      path: "category",
      select: "title",
    })
    .sort({
      createdAt: -1,
    });

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  res.status(200).json({
    _id: expense._id,
    title: expense.title,
    categoryId: expense.category._id,
    category: expense.category.title,
    amount: expense.amount,
    description: expense.description,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  });
});

exports.putEditExpense = asyncHandler(async (req, res, next) => {
  const { expenseId } = req.params;
  const { title, category, amount, description } = req.body;

  const enteredData = {
    title,
    amount,
    category,
    description: description || undefined,
  };

  const expense = await Expense.findByIdAndUpdate(expenseId, enteredData, {
    new: true,
  });

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const categoryDocument = await Category.findById(category);

  res.status(201).json({
    _id: expense._id,
    title: expense.title,
    categoryId: expense.category,
    category: categoryDocument.title,
    amount: expense.amount,
    description: expense.description,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  });
});

exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const { expenseId } = req.params;
  const expense = await Expense.findByIdAndDelete(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }
  res.status(200).json({ message: "Expense deleted successfully" });
});
