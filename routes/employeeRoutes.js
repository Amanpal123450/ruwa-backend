// routes/employeeRoutes.js
const express = require("express");
const { getEmployeeProfile, getEmployeeAppliedUsers, getEmployeeDashboard } = require("../controllers/employeeController");

const { auth,authorizeRole } = require("../middlewares/auth");

const router = express.Router();

// Only Employees can view their profile
router.get(
  "/profile",
  auth,
  authorizeRole("EMPLOYEE"),
  getEmployeeProfile
);
router.get("/applied-by-me",auth,authorizeRole("EMPLOYEE"),getEmployeeAppliedUsers)
router.get("/dash",auth,authorizeRole("EMPLOYEE"),getEmployeeDashboard)


module.exports = router