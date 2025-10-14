const express = require("express");
const router = express.Router();
const ekycCtrl = require("../controllers/E-KYCController"); // ✅ Fixed naming
const { auth, authorizeRole } = require("../middlewares/auth");


// ✅ In-memory storage for file uploads (modify if you use disk/cloud)


/**
 * ================================
 * USER ROUTES
 * ================================
 */

// ✅ Submit E-KYC Form (with multiple file uploads if needed)
router.post(
  "/user/submit",
  
  // authorizeRole("USER","EMPLOYEE"),

  ekycCtrl.submitEKYC
);

// ✅ Get E-KYC by Application ID
router.get(
  "/user/:applicationId",
  auth,
  authorizeRole("USER","EMPLOYEE"),
  ekycCtrl.getEKYCByApplicationId
);

// ✅ Get all submitted E-KYC forms for logged-in user
router.get(
  "/user",
  auth,
  authorizeRole("USER"),
  ekycCtrl.getMyEKYCForms
);

/**
 * ================================
 * ADMIN ROUTES
 * ================================
 */

// ✅ Get all E-KYC forms (with optional filters/pagination)
router.get(
  "/admin/all",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.getAllEKYCForms
);

// ✅ Get single E-KYC record by ID
router.get(
  "/admin/:applicationId",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.getEKYCByApplicationId
);

// ✅ Update verification/rejection status
router.put(
  "/admin/status/:applicationId",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.updateEKYCStatus
);

// ✅ Bulk update status (verify/reject multiple)
// router.put(
//   "/admin/bulk-update",
//   auth,
//   authorizeRole("ADMIN"),
//   ekycCtrl.b
// );

// ✅ Delete an E-KYC record
router.delete(
  "/admin/:id",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.deleteEKYC
);

// ✅ Dashboard statistics (counts, trends, etc.)
// router.get(
//   "/admin/statistics",
//   auth,
//   authorizeRole("ADMIN"),
//   ekycCtrl
// );

// ✅ Export E-KYC Data (CSV/Excel)
// router.get(
//   "/admin/export",
//   auth,
//   authorizeRole("ADMIN"),
//   ekycCtrl.
// );

module.exports = router;
