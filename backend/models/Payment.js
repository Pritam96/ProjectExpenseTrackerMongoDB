const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  order_id: { type: String, required: true },
  payment_id: { type: String, default: null },
  payment_signature: { type: String, default: null },
  amount: Number,
  amount_due: Number,
  amount_paid: Number,
  attempts: Number,
  created_at: Number,
  currency: String,
  entity: String,
  notes: {
    type: [String],
    default: [],
  },
  offer_id: {
    type: String,
    default: null,
  },
  receipt: String,
  status: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
