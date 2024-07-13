const mongoose = require("mongoose");
const { Schema } = mongoose;
const TotalExpense = require("./TotalExpense");

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

ExpenseSchema.post("save", async function (doc) {
  await updateTotalExpense(doc.user, doc.amount);
});

ExpenseSchema.post("findOneAndDelete", async function (doc) {
  await updateTotalExpense(doc.user, -doc.amount);
});

ExpenseSchema.pre("findOneAndUpdate", async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  this._originalAmount = docToUpdate.amount;
  next();
});

ExpenseSchema.post("findOneAndUpdate", async function (doc) {
  const amountDifference = doc.amount - this._originalAmount;
  await updateTotalExpense(doc.user, amountDifference);
});

async function updateTotalExpense(userId, amount) {
  await TotalExpense.findOneAndUpdate(
    { user: userId },
    { $inc: { totalAmount: amount } },
    { upsert: true }
  );
}

module.exports = mongoose.model("Expense", ExpenseSchema);
