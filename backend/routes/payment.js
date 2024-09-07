const { Router } = require("express");
const {
  postOrderCreate,
  postPaymentVerify,
} = require("../controllers/payment");
const { protect } = require("../middleware/protect");
const router = Router();

router.post("/create", protect, postOrderCreate);
router.post("/verify", protect, postPaymentVerify);

module.exports = router;
