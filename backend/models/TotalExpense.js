const mongoose = require("mongoose");
const { Schema } = mongoose;

const TotalExpenseSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TotalExpense", TotalExpenseSchema);
