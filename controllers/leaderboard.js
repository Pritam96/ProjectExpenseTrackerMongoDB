const User = require("../models/User");
const Expense = require("../models/Expense");
const Category = require("../models/Category");

exports.getUsersWithTopExpenses = async (req, res, next) => {
  try {
    const expenses = await User.aggregate([
      {
        $lookup: {
          from: "expenses",
          localField: "_id",
          foreignField: "user",
          as: "expenses",
        },
      },
      {
        $addFields: {
          totalExpense: {
            $sum: "$expenses.amount",
          },
        },
      },
      {
        $sort: {
          totalExpense: -1,
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          phoneNumber: 1,
          totalExpense: 1,
        },
      },
    ]);

    res
      .status(200)
      .json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    next(error);
  }
};
