const { Router } = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/auth");
const { protect } = require("../middleware/protect");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router;
