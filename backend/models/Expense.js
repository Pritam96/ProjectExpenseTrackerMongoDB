const mongoose = require("mongoose");
const { Schema } = mongoose;
const ExpenseSummary = require("./ExpenseSummary"); // Import the ExpenseSummary model

const ExpenseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const getDateNumber = (date) => date.getDate();

const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};

const getMonthNumber = (date) => date.getMonth() + 1;
const getYearNumber = (date) => date.getFullYear();

ExpenseSchema.pre("save", async function (next) {
  const expense = this;

  const currentDate = new Date();
  const dateNumber = getDateNumber(currentDate);
  const weekNumber = getWeekNumber(currentDate);
  const monthNumber = getMonthNumber(currentDate);
  const yearNumber = getYearNumber(currentDate);

  await ExpenseSummary.findOneAndUpdate(
    { user: expense.user },
    {
      $inc: {
        "day.totalAmount": expense.amount,
        "week.totalAmount": expense.amount,
        "month.totalAmount": expense.amount,
        "year.totalAmount": expense.amount,
      },
      $set: {
        "day.year": yearNumber,
        "day.monthNumber": monthNumber,
        "day.dayNumber": dateNumber,
        "week.year": yearNumber,
        "week.weekNumber": weekNumber,
        "month.year": yearNumber,
        "month.monthNumber": monthNumber,
        "year.year": yearNumber,
      },
    },
    { upsert: true, new: true }
  );

  next();
});

ExpenseSchema.pre("remove", async function (next) {
  const expense = this;

  const currentDate = new Date();
  const dateNumber = getDateNumber(currentDate);
  const weekNumber = getWeekNumber(currentDate);
  const monthNumber = getMonthNumber(currentDate);
  const yearNumber = getYearNumber(currentDate);

  await ExpenseSummary.findOneAndUpdate(
    { user: expense.user },
    {
      $inc: {
        "day.totalAmount": -expense.amount,
        "week.totalAmount": -expense.amount,
        "month.totalAmount": -expense.amount,
        "year.totalAmount": -expense.amount,
      },
      $set: {
        "day.year": yearNumber,
        "day.monthNumber": monthNumber,
        "day.dayNumber": dateNumber,
        "week.year": yearNumber,
        "week.weekNumber": weekNumber,
        "month.year": yearNumber,
        "month.monthNumber": monthNumber,
        "year.year": yearNumber,
      },
    },
    { new: true }
  );

  next();
});

module.exports = mongoose.model("Expense", ExpenseSchema);
