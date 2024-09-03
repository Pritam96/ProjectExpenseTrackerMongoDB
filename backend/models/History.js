const mongoose = require("mongoose");
const { Schema } = mongoose;

const HistorySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    yearlyTotals: [
      {
        year: Number,
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    monthlyTotals: [
      {
        year: Number,
        month: Number,
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    weeklyTotals: [
      {
        year: Number,
        week: Number,
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    todayTotal: {
      year: Number,
      month: Number,
      day: Number,
      total: {
        type: Number,
        default: 0,
      },
    },
    previousDayTotal: {
      year: Number,
      month: Number,
      day: Number,
      total: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", HistorySchema);
