const mongoose = require("mongoose");
const { Schema } = mongoose;
const History = require("./History");

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

// Middleware to update history totals after saving a new expense
ExpenseSchema.post("save", async function (doc) {
  try {
    await updateHistoryTotals(doc.user, doc.amount);
  } catch (error) {
    console.error("Error updating history totals after save:", error);
  }
});

// Middleware to handle updates and manage amounts
ExpenseSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      this._originalAmount = docToUpdate.amount;
    }
    next();
  } catch (error) {
    next(error);
  }
});

ExpenseSchema.post("findOneAndUpdate", async function (doc) {
  try {
    if (doc) {
      const amountDifference = doc.amount - this._originalAmount;
      await updateHistoryTotals(doc.user, amountDifference);
    }
  } catch (error) {
    console.error("Error updating history totals after update:", error);
  }
});

// Middleware to update history totals after deleting an expense
ExpenseSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (doc) {
      await updateHistoryTotals(doc.user, -doc.amount);
    }
  } catch (error) {
    console.error("Error updating history totals after delete:", error);
  }
});

// Function to update history totals
async function updateHistoryTotals(userId, amount) {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentWeek = getWeekNumber(currentDate);
    // const currentDay = currentDate.getDate();
    const currentDay = 4;

    // Retrieve or create the user's history document
    let history = await History.findOne({ user: userId });

    if (!history) {
      history = new History({ user: userId });
    }

    // Update total amounts
    history.total += amount;

    // Update yearly totals
    await updateNestedTotal(
      history,
      "yearlyTotals",
      { year: currentYear },
      amount
    );

    // Update monthly totals
    await updateNestedTotal(
      history,
      "monthlyTotals",
      { year: currentYear, month: currentMonth },
      amount
    );

    // Update weekly totals
    await updateNestedTotal(
      history,
      "weeklyTotals",
      { year: currentYear, week: currentWeek },
      amount
    );

    // Check if the current date is the same as the current 'todayTotal' date
    if (
      history.todayTotal.year === currentYear &&
      history.todayTotal.month === currentMonth &&
      history.todayTotal.day === currentDay
    ) {
      // Update today's total if it's the same day
      history.todayTotal.total += amount;
    } else {
      // If it's a new day, move today's total to previousDayTotal
      history.previousDayTotal = { ...history.todayTotal };

      // Reset today's total to the current day
      history.todayTotal = {
        year: currentYear,
        month: currentMonth,
        day: currentDay,
        total: amount,
      };
    }

    // Save the history document, ensuring no parallel saves
    await history.save();
  } catch (error) {
    console.error("Error updating history totals:", error);
  }
}

// Helper function to calculate the week number of the year
function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff =
    date -
    start +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek) + 1;
}

// Helper function to update totals in nested arrays
async function updateNestedTotal(history, key, matchFields, amount) {
  // Find the index of the matching entry in the array
  const index = history[key].findIndex((item) => {
    return Object.keys(matchFields).every(
      (field) => item[field] === matchFields[field]
    );
  });

  if (index !== -1) {
    // If the entry exists, increment the total
    history[key][index].total += amount;
  } else {
    // If the entry does not exist, add a new one
    history[key].push({ ...matchFields, total: amount });
  }
}

module.exports = mongoose.model("Expense", ExpenseSchema);
