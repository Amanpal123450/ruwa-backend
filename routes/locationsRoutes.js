const express = require("express");
const router = express.Router();
const { auth, authorizeRole } = require("../middlewares/auth");
const {
  updateLocation,
  getAllLatestEmployees,
} = require("../controllers/locationController");

// Employee → Update location
router.post("/update-location", auth, authorizeRole("EMPLOYEE"), updateLocation);

// Admin → Get employees with location
router.get("/employees", auth, authorizeRole("ADMIN"), getAllLatestEmployees);

module.exports = router;
