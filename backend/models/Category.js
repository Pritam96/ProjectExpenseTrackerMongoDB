const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  title: {
    type: String,
    required: [true, "Category name is required"],
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
