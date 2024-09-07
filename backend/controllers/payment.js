const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const razorpay = require("razorpay");
const shortid = require("shortid");
const Payment = require("../models/Payment");

const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order instance
exports.postOrderCreate = asyncHandler(async (req, res, next) => {
  const payment_capture = 1;
  const amount = 50000; // amount in the smallest currency unit
  const currency = "INR";
  const receipt = `receipt_${shortid.generate()}`;

  const options = {
    amount,
    currency,
    receipt,
    payment_capture,
  };

  // Initiate order creation
  const order = await instance.orders.create(options);

  // Saving payment information
  await Payment.create({
    ...order,
    user: req.user._id,
    order_id: order.id,
  });

  res.status(200).json({
    ...order,
    name: req.user.username,
    email: req.user.email,
    contact: req.user.phone,
  });
});

exports.postPaymentVerify = asyncHandler(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Invalid Payment Details");
  }

  // Verify the payment signature
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid Signature");
  }

  const payment = await Payment.findOne({ order_id: razorpay_order_id });

  if (!payment) {
    return res.status(404).json({ message: "Payment not found." });
  }

  // Update payment details
  payment.payment_id = razorpay_payment_id;
  payment.payment_signature = razorpay_signature;
  payment.amount_due = 0;
  payment.amount_paid = payment.amount;
  payment.status = "paid";
  await payment.save();

  res.status(200).json({
    payment_id: razorpay_payment_id,
    payment_signature: razorpay_signature,
    amount_due: 0,
    amount_paid: payment.amount,
    status: "paid",
  });
});
