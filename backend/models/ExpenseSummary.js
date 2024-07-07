const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExpenseSummarySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      year: Number,
      monthNumber: Number,
      dayNumber: Number,
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
    week: {
      year: Number,
      weekNumber: Number,
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
    month: {
      year: Number,
      monthNumber: Number,
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
    year: {
      year: Number,
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExpenseSummary", ExpenseSummarySchema);
