const express = require("express");
const router = express.Router();
const { 
  userApply, 
  employeeApply, 
  getMyApplications, 
  getEmployeeApplications, 
  getAllApplications, 
  updateJanArogyaStatus, 
  employeeupdateJanArogyaStatus,
  verifyPayment,
  checkJanarogyaApply,
  getApprovedApplications,
  adminOfflineApply
} = require("../controllers/janArogyaApplyController");

const { auth, authorizeRole } = require("../middlewares/auth");

// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
router.post("/verify-payment",auth, authorizeRole("EMPLOYEE", "USER"), verifyPayment);

const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
router.post("/verify-payment", auth, authorizeRole("EMPLOYEE","USER"),  verifyPayment);

// USER applies for themselves
router.post(
  "/apply",
  auth,
  authorizeRole("USER"),
  userApply
);

// EMPLOYEE applies on behalf of user
router.post(
  "/employee/apply",
  auth,
  authorizeRole("EMPLOYEE"),
  employeeApply
);
router.post(
  "/admin/offline-apply",
  auth,
  authorizeRole("ADMIN"),
  adminOfflineApply
);
router.get("/check",auth,checkJanarogyaApply)
// USER: Get their own apps
router.get("/my-applications", auth, authorizeRole("USER"), getMyApplications);

// EMPLOYEE: Get apps they submitted
router.get("/employee/applications", auth, authorizeRole("EMPLOYEE"), getEmployeeApplications);

// ADMIN: Get all
router.get("/admin/all", auth, authorizeRole("ADMIN"), getAllApplications);
router.get("/admin/aprooved", auth, authorizeRole("ADMIN"), getApprovedApplications);

// ADMIN: Update status
router.put("/admin/status/:id", auth, authorizeRole("ADMIN"), updateJanArogyaStatus);
router.put("/withdrawn", auth, authorizeRole("EMPLOYEE"), employeeupdateJanArogyaStatus);

module.exports = router;
