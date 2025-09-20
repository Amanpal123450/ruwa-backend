const express = require("express");
const { getDashboard, upsertDashboard } = require("../controllers/AppDashboardController");

const router = express.Router();

// Get dashboard content
router.get("/", getDashboard);

// Create or update dashboard
router.post("/", upsertDashboard);

module.exports = router;
