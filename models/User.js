const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    isAdmin: { type: Boolean, default: false },
    username: { type: String, required: [true, "Username is required"] },
    email: {
      type: String,
      unique: true,
      required: [true, "Email ID is required"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
    },
    passwordHash: {
      type: String,
      select: false,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model("User", UserSchema);
