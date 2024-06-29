const asyncHandler = require("express-async-handler");
const { Parser } = require("json2csv");
const moment = require("moment");
const Expense = require("../models/Expense");

exports.getExpensesByRange = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Expense.countDocuments({
    user: req.user._id,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const expenses = await Expense.find({
    user: req.user._id,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })
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
    count: expenses.length,
    pagination,
    expenses,
  });
});

exports.downloadCsv = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const expenses = await Expense.find({
    user: req.user._id,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate({
    path: "category",
    select: "categoryName description",
  });

  const expenseData = expenses.map((expense) => {
    const { _id, amount, statement, category, subExpense, createdAt } = expense;

    return {
      expenseId: _id.toString(),
      amount,
      title: statement,
      category: category ? category.categoryName : "",
      description: subExpense ? subExpense : "",
      date: moment(createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    };
  });

  const csvFields = [
    "expenseId",
    "amount",
    "title",
    "category",
    "description",
    "date",
  ];

  const csvParser = new Parser({ csvFields });
  const csvData = csvParser.parse(expenseData);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment: filename=data${Date.now()}.csv`
  );

  res.status(200).end(csvData);
});
