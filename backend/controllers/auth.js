const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, phoneNumber, password } = req.body;
  const user = await User.create({
    username,
    email,
    phoneNumber,
    passwordHash: password,
  });
  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password.");
  }
  const user = await User.findOne({ email }).select("+passwordHash");

  if (user && (await user.matchPassword(password))) {
    return sendTokenResponse(user, 200, res);
  }
  res.status(401);
  throw new Error("Invalid Credentials.");
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phoneNumber,
    isPremium: user.isPremium,
    token,
  });
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error("There is no user with that email");
  }

  const resetToken = await user.getResetPasswordToken();

  // Don't run any validation before save
  await user.save({ validateBeforeSave: false });

  // Creating reset URL - http://localhost:5000/api/auth/resetPassword/:resetToken
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/auth/resetPassword/${resetToken}`;

  const resetUrl = `${req.protocol}://${process.env.CLIENT_URL}/reset/${resetToken}`;

  const message = `You are receiving this email because you has requested the reset of a password. Please go to this link: \n\n${resetUrl}`;

  try {
    // Sending the un-hashed token to the user by email
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent");
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Password reset token is invalid");
  }

  user.passwordHash = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phoneNumber,
    isPremium: user.isPremium,
  });
});
