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
  const limit = parseInt(req.query.limit, 10) || 4;
  const skip = (page - 1) * limit;

  const userId = req.user._id;
  const start = moment(startDate).startOf("day").toDate();
  const end = moment(endDate).endOf("day").toDate();

  const totalExpenses = await Expense.countDocuments({
    user: userId,
    createdAt: { $gte: start, $lte: end },
  });

  const expenses = await Expense.find({
    user: userId,
    createdAt: { $gte: start, $lte: end },
  })
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "title" });

  const transformedExpenses = expenses.map((expense) => ({
    _id: expense._id,
    title: expense.title,
    category: expense.category.title,
    amount: expense.amount,
    description: expense.description,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  }));

  const totalExpenseData = await Expense.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: start, $lte: end },
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

  // Pagination result
  const pagination = {
    total: Math.ceil(totalExpenses / limit),
    current: page,
  };

  if (page * limit < totalExpenses) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (skip > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    pagination,
    totalExpense,
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
