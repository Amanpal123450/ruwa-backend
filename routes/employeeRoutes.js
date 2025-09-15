// routes/employeeRoutes.js
const express = require("express");
const { getEmployeeProfile, getEmployeeAppliedUsers, getEmployeeDashboard, getEmployeeServiceUsers, getAppliedByMe } = require("../controllers/employeeController");

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
router.get("/applied-all-users",auth,authorizeRole("EMPLOYEE"),getAppliedByMe)
router.get("/service-users", auth,authorizeRole("EMPLOYEE"), getEmployeeServiceUsers);

module.exports = router