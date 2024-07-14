const { Router } = require("express");
const { getLeaderBoard } = require("../controllers/report");
const { protect } = require("../middleware/protect");
const router = Router();

router.get("/", protect, getLeaderBoard);

module.exports = router;
