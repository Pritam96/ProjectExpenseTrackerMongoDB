const Category = require("../models/Category");

exports.addCategory = async (req, res, next) => {
  try {
    const { categoryName, description } = req.body;
    let data = { categoryName, description };
    if (!req.user.isAdmin) {
      data.user = req.user._id;
    }
    const category = await Category.create(data);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      $or: [{ user: req.user._id }, { user: null }],
    }).sort({ updatedAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        count: categories.length,
        categories: categories,
      },
    });
  } catch (error) {
    next(error);
  }
};
