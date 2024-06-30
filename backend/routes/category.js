const { Router } = require("express");
const { addCategory, getCategories } = require("../controllers/category");
const { protect } = require("../middleware/protect");
const router = Router();

router.post("/add", addCategory);
router.get("/", protect, getCategories);

module.exports = router;
