const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const { username, email, phoneNumber, password } = req.body;
    const user = await User.create({
      username,
      email,
      phoneNumber,
      passwordHash: password,
    });
    const token = user.getSignedToken();
    res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password.", 400)
      );
    }
    const user = await User.findOne({ email }).select("+passwordHash");

    if (user && (await user.matchPassword(password))) {
      const token = user.getSignedToken();
      return res.status(200).json({ success: true, token });
    }
    return next(new ErrorResponse("Invalid Credentials.", 401));
  } catch (error) {
    next(error);
  }
};
