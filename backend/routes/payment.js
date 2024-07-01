const { Router } = require("express");
const {
  postOrderCreate,
  postPaymentVerify,
  getKey,
} = require("../controllers/payment");
const { protect } = require("../middleware/protect");
const router = Router();

router.post("/create", protect, postOrderCreate);
router.get("/key", protect, getKey);
router.post("/verify", protect, postPaymentVerify);

module.exports = router;
