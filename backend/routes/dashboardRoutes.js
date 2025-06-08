const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getDashboardStats);

module.exports = router;
