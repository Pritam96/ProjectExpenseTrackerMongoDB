const asyncHandler = require("express-async-handler");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const moment = require("moment");

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
  const total = await Expense.countDocuments({ user: req.user._id });

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

exports.getTotalExpenseByDateRange = asyncHandler(async (req, res, next) => {
  const { start, end } = req.query;

  if (start && end) {
    const totalExpenses = await calculateTotalExpenseByDateRange(
      req,
      moment(start).startOf("day").toDate(),
      moment(end).endOf("day").toDate()
    );
    return res.status(200).json({
      totalExpenses,
    });
  }

  const [daily, weekly, monthly, yearly] = await Promise.all([
    calculateTotalExpenseByDateRange(
      req,
      dateRanges.daily.start,
      dateRanges.daily.end
    ),
    calculateTotalExpenseByDateRange(
      req,
      dateRanges.weekly.start,
      dateRanges.weekly.end
    ),
    calculateTotalExpenseByDateRange(
      req,
      dateRanges.monthly.start,
      dateRanges.monthly.end
    ),
    calculateTotalExpenseByDateRange(
      req,
      dateRanges.yearly.start,
      dateRanges.yearly.end
    ),
  ]);

  res.status(200).json({
    daily,
    weekly,
    monthly,
    yearly,
  });
});

const calculateTotalExpenseByDateRange = async (req, start, end) => {
  try {
    const totalExpenseData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return totalExpenseData[0]?.total || 0;
  } catch (error) {
    console.error("Error calculating total expense:", error);
    res.status(500);
    throw new Error("Failed to calculate total expense");
  }
};

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
