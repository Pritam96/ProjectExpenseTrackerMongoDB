const asyncHandler = require("express-async-handler");
const User = require("../models/User");

exports.getUsersWithTopExpenses = asyncHandler(async (req, res, next) => {
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
    {
      $setWindowFields: {
        partitionBy: "_id",
        sortBy: { totalExpense: -1 },
        output: {
          rank: {
            $rank: {},
          },
        },
      },
    },
    {
      $limit: 5,
    },
  ]);

  res.status(200).json({ count: expenses.length, data: expenses });
});
