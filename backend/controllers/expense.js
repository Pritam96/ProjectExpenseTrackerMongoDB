const asyncHandler = require("express-async-handler");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const moment = require("moment");
const ExpenseSummary = require("../models/ExpenseSummary");

const dateRanges = {
  daily: {
    start: moment(Date.now()).startOf("day").toDate(),
    end: moment(Date.now()).endOf("day").toDate(),
  },
  weekly: {
    start: moment(Date.now()).startOf("week").toDate(),
    end: moment(Date.now()).endOf("week").toDate(),
  },
  monthly: {
    start: moment(Date.now()).startOf("month").toDate(),
    end: moment(Date.now()).endOf("month").toDate(),
  },
  yearly: {
    start: moment(Date.now()).startOf("year").toDate(),
    end: moment(Date.now()).endOf("year").toDate(),
  },
};

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
  const type = req.query.type || "daily";
  const dateRange = dateRanges[type];

  const startIndex = (page - 1) * limit;
  const total = await Expense.countDocuments({
    user: req.user._id,
    createdAt: { $gte: dateRange.start, $lte: dateRange.end },
  });

  const expenses = await Expense.find({
    user: req.user._id,
    createdAt: { $gte: dateRange.start, $lte: dateRange.end },
  })
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
    total: Math.ceil(total / limit),
    current: page,
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

exports.getExpenseSummary = asyncHandler(async (req, res, next) => {
  // yearly expense => year
  // monthly expense => year , monthNumber
  // weekly expense => year, weekNumber
  // daily expense => year, monthNumber, dayNumber

  const { year, month, week, day } = req.query;

  const currentYear = parseInt(year || moment(Date.now()).format("YYYY"));

  let query = { user: req.user._id };

  if (day && month) {
    query = {
      ...query,
      "day.year": currentYear,
      "day.monthNumber": parseInt(week),
      "day.dayNumber": parseInt(day),
    };
  } else if (week) {
    query = {
      ...query,
      "week.year": currentYear,
      "week.weekNumber": parseInt(week),
    };
  } else if (month) {
    query = {
      ...query,
      "month.year": currentYear,
      "month.monthNumber": parseInt(month),
    };
  } else {
    query = {
      ...query,
      "year.year": currentYear,
    };
  }

  const response = await ExpenseSummary.findOne(query);

  res.status(200).json({
    daily: response?.day.totalAmount || 0,
    weekly: response?.week.totalAmount || 0,
    monthly: response?.month.totalAmount || 0,
    yearly: response?.year.totalAmount || 0,
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
