const express = require("express");
const router = express.Router();
const janCtrl = require("../controllers/janArogyaController");
const { auth, authorizeRole } = require("../middlewares/auth");
const multer = require("multer");

// In-memory file storage like applyInsurance
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
  janCtrl.userApplyJanarogya
);

router.get(
  "/user",
  auth,
  authorizeRole("USER"),
  janCtrl.getUserApplication
);
router.get("/check",auth,janCtrl.checkJanarogya)
/**
 * ================================
 * EMPLOYEE ROUTES
 * ================================
 */
router.post(
  "/employee/apply",
  auth,
  authorizeRole("EMPLOYEE"),
  janCtrl.applyJanarogya
);


router.get(
  "/employee",
  auth,
  authorizeRole("EMPLOYEE"),
  janCtrl.getJanarogyaApplications
);

router.put(
  "/withdraw/:id",
  auth,
  authorizeRole("EMPLOYEE"),
  janCtrl.withdrawApplication
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
  janCtrl.getAllApplications
);

router.put(
  "/admin/status/:id",
  auth,
  authorizeRole("ADMIN"),
  janCtrl.updateApplicationStatus
);

module.exports = router;
