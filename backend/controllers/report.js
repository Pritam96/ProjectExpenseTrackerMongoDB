const asyncHandler = require("express-async-handler");
const History = require("../models/History");

const transFormEmail = (email) => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return "*".repeat(localPart.length) + "@" + domain;
  }

  const visiblePart = localPart.slice(0, 2); // Keep the first two characters
  const blurredPart = "*".repeat(localPart.length - 2); // Replace the rest with asterisks
  const transformedEmail = `${visiblePart}${blurredPart}@${domain}`;

  return transformedEmail;
};

const transformPhoneNumber = (phoneNumber) => {
  if (phoneNumber.length <= 8) {
    return `${phoneNumber.slice(0, 4)}${"*".repeat(phoneNumber.length - 4)}`;
  }
  const visibleStart = phoneNumber.slice(0, 2); // Keep the first 2 digits
  const visibleEnd = phoneNumber.slice(-2); // Keep the last 2 digits
  const blurredPart = "*".repeat(6); // Replace the middle 6 digits with asterisks

  return `${visibleStart}${blurredPart}${visibleEnd}`;
};

exports.getLeaderBoard = asyncHandler(async (req, res, next) => {
  const topUsersByExpenses = await History.find()
    .populate({
      path: "user",
      select: "username email phoneNumber",
    })
    .sort({ totalAmount: -1 })
    .limit(5);

  const transformedData = topUsersByExpenses.map((user, index) => {
    return {
      _id: user.user._id,
      username: user.user.username,
      email:
        req.user._id.toString() !== user.user._id.toString()
          ? transFormEmail(user.user.email)
          : user.user.email,
      phoneNumber:
        req.user._id.toString() !== user.user._id.toString()
          ? transformPhoneNumber(user.user.phoneNumber)
          : user.user.phoneNumber,
      position: index + 1,
      totalAmount: user.total,
    };
  });

  res.status(200).json({
    data: transformedData,
  });
});
