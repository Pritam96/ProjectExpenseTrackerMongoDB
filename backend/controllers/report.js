const asyncHandler = require("express-async-handler");
const { Parser } = require("json2csv");
const moment = require("moment");
const Expense = require("../models/Expense");

exports.getExpensesByRange = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error("Start date and end date are required.");
  }

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
      select: "title",
    });

  const transformedExpenses = expenses.map((expense) => ({
    _id: expense._id,
    title: expense.title,
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

exports.downloadCsv = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error("Start date and end date are required.");
  }

  if (
    !moment(startDate, moment.ISO_8601, true).isValid() ||
    !moment(endDate, moment.ISO_8601, true).isValid()
  ) {
    res.status(400);
    throw new Error(
      "Invalid date format. Please provide valid ISO 8601 dates."
    );
  }

  const expenses = await Expense.find({
    user: req.user._id,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate({
    path: "category",
    select: "title",
  });

  const transformedExpenses = expenses.map((expense) => ({
    id: expense._id.toString(),
    title: expense.title,
    category: expense.category.title,
    amount: expense.amount,
    description: expense.description ? expense.description : "",
    created: moment(expense.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    updated: moment(expense.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
  }));

  const csvFields = [
    { label: "ID", value: "id" },
    { label: "Title", value: "title" },
    { label: "Category", value: "category" },
    { label: "Amount", value: "amount" },
    { label: "Description", value: "description" },
    { label: "Created", value: "created" },
    { label: "Updated", value: "updated" },
  ];

  const csvParser = new Parser({ csvFields });
  const csvData = csvParser.parse(transformedExpenses);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment: filename=expenses_${Date.now()}.csv`
  );

  res.status(200).end(csvData);
});
