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
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 4;
  const start = req.query.start ? new Date(req.query.start) : null;
  const end = req.query.end ? new Date(req.query.end) : null;

  const startIndex = (page - 1) * limit;

  // Build the base query
  const query = { user: req.user._id };
  if (start && end) {
    query.createdAt = { $gte: start, $lte: end };
  }

  const total = await Expense.countDocuments(query);

  const expenses = await Expense.find(query)
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: "category",
      select: "title",
    })
    .sort({ createdAt: -1 });

  const transformedExpenses = expenses.map((expense) => ({
    _id: expense._id,
    title: expense.title,
    categoryId: expense.category?._id || null,
    category: expense.category?.title || "Uncategorized",
    amount: expense.amount,
    description: expense.description,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  }));

  // Build the pagination result
  const pagination = {
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };

  if (startIndex + limit < total) {
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
    expenses: transformedExpenses,
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
  res.status(200).json({ _id: expense._id });
});
