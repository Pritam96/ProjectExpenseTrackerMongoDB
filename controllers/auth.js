const path = require("path");
const crypto = require("crypto");

const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

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

exports.forgotPassword = async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404));
    }

    const resetToken = await user.getResetPasswordToken();

    // Don't run any validation before save
    await user.save({ validateBeforeSave: false });

    // Creating reset URL - http://localhost:5000/api/auth/resetPassword/:resetToken
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you has requested the reset of a password. Please make a PUT request to: \n\n${resetUrl}`;

    // Sending the un-hashed token to the user by email
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.body.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return next(new ErrorResponse("Invalid token", 400));

    user.passwordHash = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const token = user.getSignedToken();
    res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

exports.setNewPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const hostUrl = `${req.protocol}://${req.get("host")}`;
  res.status(200).send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login</title>
      <!-- Add Bootstrap CSS -->
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossorigin="anonymous"
      />
    </head>
    <body
      class="container mt-5 d-flex justify-content-center align-items-center vh-100"
    >
      <div class="login-form p-4 card col-sm-10 col-md-8 col-lg-6 col-xl-6">
        <input
          type="text"
          name="reset-token"
          id="reset-token"
          value="${resetToken}"
        />
        <div class="form-group">
          <label for="password">New Password:</label>
          <input
            type="password"
            class="form-control mb-3"
            name="password"
            id="password"
          />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password:</label>
          <input
            type="password"
            class="form-control mb-3"
            name="confirm-password"
            id="confirm-password"
          />
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block" id="save-password-button">
            Save
          </button>
        </div>
        <div class="form-group">
          <a href="${hostUrl}/login.html">Back to Login</a>
        </div>
      </div>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js"
        integrity="sha512-b94Z6431JyXY14iSXwgzeZurHHRNkLt9d6bAHt7BZT38eqV+GyngIi/tVye4jBKPYQ2lBdRs0glww4fmpuLRwA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      ></script>
      <!-- Add Bootstrap JS (popper.js is required for some Bootstrap components) -->
      <script
        src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"
      ></script>
  
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js"
        integrity="sha512-b94Z6431JyXY14iSXwgzeZurHHRNkLt9d6bAHt7BZT38eqV+GyngIi/tVye4jBKPYQ2lBdRs0glww4fmpuLRwA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      ></script>
      <script>
        const saveNewPasswordButton = document.getElementById(
          "save-password-button"
        );
        const enteredPassword = document.getElementById("password");
        const enteredConfirmPassword =
          document.getElementById("confirm-password");
        const resetToken = document.getElementById("reset-token");
  
        saveNewPasswordButton.addEventListener("click", async () => {
          // Get Reset token
          if (resetToken.value.trim() === "") {
            alert("Reset token is missing! Please try again");
            return;
          }
  
          if (
            enteredPassword.value === "" ||
            enteredConfirmPassword.value === ""
          ) {
            alert("Please provide all fields!");
            return;
          }
          if (enteredPassword.value !== enteredConfirmPassword.value) {
            alert("Password not matched!");
            return;
          }
          try {
            const response = await axios.put(
              "http://localhost:5000/api/auth/resetPassword",
              {
                resetToken: resetToken.value.trim(),
                password: enteredPassword.value.trim(),
              }
            );
            console.log(response);
            alert("Password changed successfully!");
            resetToken.value = "";
            enteredPassword.value = "";
            enteredConfirmPassword.value = "";
          } catch (error) {
            if (error.response) alert(error.response.data.error);
            else console.log(error);
          }
        });
      </script>
    </body>
  </html>
  `);
};
