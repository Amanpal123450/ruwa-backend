const express = require("express");
const router = express.Router();
const insCtrl = require("../controllers/applyInsuranceController");
const { auth, authorizeRole } = require("../middlewares/auth");
const multer = require("multer");

// In-memory file storage (like JanArogya)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * ================================
 * USER ROUTES
 * ================================
 */
router.post(
  "/user/apply",
  auth,
  authorizeRole("USER"),
  insCtrl.userApplyInsurance
);

router.get(
  "/user",
  auth,
  authorizeRole("USER"),
  insCtrl.getUserInsuranceApplications
);

router.get("/check",auth,insCtrl.checkJanarogya)

/**
 * ================================
 * EMPLOYEE ROUTES
 * ================================
 */
router.post(
  "/employee/apply",
  auth,
  authorizeRole("EMPLOYEE"),
  insCtrl.applyInsurance
);

router.get(
  "/employee",
  auth,
  authorizeRole("EMPLOYEE"),
  insCtrl.getEmployeeInsuranceApplications
);

router.put(
  "/withdrawn/:id",
  auth,
  authorizeRole("EMPLOYEE"),
  insCtrl.withdrawInsuranceApplication
);

/**
 * ================================
 * ADMIN ROUTES
 * ================================
 */
router.get(
  "/admin/all",
  auth,
  authorizeRole("ADMIN"),
  insCtrl.getAllInsuranceApplications
);

router.patch(
  "/admin/status/:id",
  auth,
  authorizeRole("ADMIN"),
  insCtrl.updateInsuranceApplicationStatus
);

module.exports = router;
