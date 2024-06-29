const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");

exports.addCategory = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  let data = { title, description };
  await Category.create(data);
  res.status(200).json({ message: "Category added successfully" });
});

exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find()
    .select("_id title description createdAt")
    .sort({ createdAt: 1 });

  res.status(200).json({
    count: categories.length,
    categories: categories,
  });
});
