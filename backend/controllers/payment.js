const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const amount = 1000; // Amount in paise
  const currency = "INR";

  const options = {
    amount,
    currency,
    receipt: "order_receipt#1",
    payment_capture: 1,
  };

  const order = await razorpay.orders.create(options);

  const payment = new Payment({
    orderId: order.id,
    user: req.user._id,
  });

  await payment.save();

  res.status(200).json({
    key_id: process.env.RAZORPAY_KEY_ID,
    ...order,
  });
});

exports.capturePayment = asyncHandler(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  // Verify the payment signature
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid Signature");
  }

  const payment = await Payment.findOne({ orderId: razorpay_order_id });
  payment.paymentId = razorpay_payment_id;
  payment.status = "complete";
  const updatedPayment = await payment.save();

  req.user = await User.findByIdAndUpdate(
    req.user._id,
    { isPremium: true },
    { new: true }
  );

  // Send a success response to the client
  res.status(200).json({ data: updatedPayment });
});
