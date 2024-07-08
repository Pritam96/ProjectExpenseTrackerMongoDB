const mongoose = require("mongoose");
const { Schema } = mongoose;

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

module.exports = mongoose.model("Expense", ExpenseSchema);
