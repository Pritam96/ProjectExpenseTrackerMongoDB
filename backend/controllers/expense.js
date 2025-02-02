const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const { Parser } = require("json2csv");
const moment = require("moment");
const History = require("../models/History");

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const validateDateTime = (dateTime) => {
  return moment(dateTime, moment.ISO_8601, true).isValid();
};

const getHistoryData = async (userId) => {
  try {
    const historyData = await History.findOne({
      user: userId,
    });
    if (!historyData) return {};
    return {
      total: historyData.total,
      daily: historyData.dailyTotals.slice(-10),
      weekly: historyData.weeklyTotals,
      monthly: historyData.monthlyTotals,
      yearly: historyData.yearlyTotals,
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};

exports.postExpense = asyncHandler(async (req, res, next) => {
  const { amount, category, description, date } = req.body;
  const userId = req.user._id;

  if (date && !validateDateTime(date)) {
    res.status(400);
    throw new Error("Invalid date format");
  }
  const parsedDate = date ? new Date(date) : undefined;

  if (!validateObjectId(category)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }
  const categoryDocument = await Category.findById(category);
  if (!categoryDocument) {
    res.status(400);
    throw new Error("Category not found");
  }

  const enteredData = {
    user: userId,
    amount,
    category: categoryDocument._id,
    description: description || undefined,
    date: parsedDate,
  };

  const expense = await Expense.create(enteredData);

  const historyData = await getHistoryData(userId);

  res.status(201).json({
    expense: {
      _id: expense._id,
      categoryId: expense.category,
      category: categoryDocument.title,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
      // createdAt: expense.createdAt,
      // updatedAt: expense.updatedAt,
    },
    history: historyData,
  });
});

exports.getExpenses = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 4;
  const start =
    req.query.start && validateDateTime(req.query.start)
      ? new Date(req.query.start)
      : null;
  const end =
    req.query.end && validateDateTime(req.query.end)
      ? new Date(req.query.end)
      : null;
  const startIndex = (page - 1) * limit;

  const userId = req.user._id;

  // Build the base query
  const query = { user: userId };
  if (start && end) {
    query.date = { $gte: start, $lte: end };
  }

  const total = await Expense.countDocuments(query);

  const expenses = await Expense.find(query)
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: "category",
      select: "title",
    })
    .sort({ date: -1 });

  const historyData = await getHistoryData(userId);

  const transformedExpenses = expenses.map((expense) => ({
    _id: expense._id,
    categoryId: expense.category?._id || null,
    category: expense.category?.title || "Uncategorized",
    amount: expense.amount,
    description: expense.description,
    date: expense.date,
    // createdAt: expense.createdAt,
    // updatedAt: expense.updatedAt,
  }));

  // Build the pagination result
  const pagination = {
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    next: startIndex + limit < total ? page + 1 : undefined,
    prev: startIndex > 0 ? page - 1 : undefined,
    limit,
  };

  res.status(200).json({
    expenses: transformedExpenses,
    pagination,
    count: total,
    history: historyData,
  });
});

exports.putEditExpense = asyncHandler(async (req, res, next) => {
  const { expenseId } = req.params;
  const { category, amount, description, date } = req.body;

  if (!validateObjectId(expenseId)) {
    res.status(400);
    throw new Error("Invalid expense ID");
  }

  const userId = req.user._id;

  if (date && !validateDateTime(date)) {
    res.status(400);
    throw new Error("Invalid date format");
  }
  const parsedDate = date ? new Date(date) : undefined;

  const enteredData = {
    amount,
    category,
    description: description || undefined,
    date: parsedDate,
  };

  const expense = await Expense.findByIdAndUpdate(expenseId, enteredData, {
    new: true,
  });

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const categoryDocument = await Category.findById(category);
  if (!categoryDocument) {
    res.status(400);
    throw new Error("Invalid category ID");
  }

  const historyData = await getHistoryData(userId);

  res.status(201).json({
    expense: {
      _id: expense._id,
      amount: expense.amount,
      categoryId: expense.category,
      category: categoryDocument.title,
      description: expense.description,
      date: expense.date,
      // createdAt: expense.createdAt,
      // updatedAt: expense.updatedAt,
    },
    history: historyData,
  });
});

exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const { expenseId } = req.params;
  const userId = req.user._id;

  if (!validateObjectId(expenseId)) {
    res.status(400);
    throw new Error("Invalid expense ID");
  }

  const expense = await Expense.findByIdAndDelete(expenseId);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const historyData = await getHistoryData(userId);

  res.status(204).json({
    deleted_id: expense._id,
    history: historyData,
  });
});

exports.downloadCsv = asyncHandler(async (req, res, next) => {
  const { start, end } = req.query;
  const userId = req.user._id;

  if (!start || !end) {
    res.status(400);
    throw new Error("Start date and end date are required.");
  }

  if (!validateDateTime(start) || !validateDateTime(end)) {
    res.status(400);
    throw new Error(
      "Invalid date format. Please provide valid ISO 8601 dates."
    );
  }

  const expenses = await Expense.find({
    user: userId,
    date: { $gte: new Date(start), $lte: new Date(end) },
  }).populate({
    path: "category",
    select: "title",
  });

  const totalExpenseData = await Expense.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: new Date(start), $lte: new Date(end) },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalExpense = totalExpenseData[0]?.total || 0;

  const transformedExpenses = expenses.map((expense) => ({
    id: expense._id.toString(),
    category: expense.category.title,
    amount: parseFloat(expense.amount).toFixed(2),
    description: expense.description ? expense.description : "",
    date: moment(expense.date).format("MMMM Do YYYY, h:mm:ss a"),
  }));

  transformedExpenses.push({
    id: "Total",
    amount: totalExpense.toFixed(2),
    category: "-",
    description: "-",
    date: `${moment(start).format("YYYY-MM-DD")} - ${moment(end).format(
      "YYYY-MM-DD"
    )}`,
  });

  const csvFields = [
    { label: "ID", value: "id" },
    { label: "Amount", value: "amount" },
    { label: "Category", value: "category" },
    { label: "Description", value: "description" },
    { label: "Date", value: "date" },
  ];

  const csvParser = new Parser({ fields: csvFields });
  const csvData = csvParser.parse(transformedExpenses);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=expenses_${Date.now()}.csv`
  );

  res.status(200).end(csvData);
});
