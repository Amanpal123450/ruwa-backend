const express = require("express");
const router = express.Router();
const ekycCtrl = require("../controllers/EKYCController");
const { auth, authorizeRole } = require("../middlewares/auth");


/**
 * ================================
 * USER ROUTES
 * ================================
 */

// User: Submit E-KYC Form (with multiple file uploads)
router.post(
  "/user/submit",
  auth,
  authorizeRole("USER"),
 
  ekycCtrl.submitEKYC
);

// User: Get E-KYC by Application ID
router.get(
  "/user/:applicationId",
  auth,
  authorizeRole("USER"),
  ekycCtrl.getEKYCByApplicationId
);

// User: Get all submitted E-KYC forms
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

// Admin: Get all E-KYC forms (filters, pagination)
router.get(
  "/admin/all",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.getAllEKYCForms
);

// Admin: Get single E-KYC record by ID
router.get(
  "/admin/:id",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.getEKYCById
);

// Admin: Update status (verify / reject)
router.put(
  "/admin/status/:id",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.updateEKYCStatus
);

// Admin: Bulk update status for multiple records
router.put(
  "/admin/bulk-update",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.bulkUpdateStatus
);

// Admin: Delete an E-KYC record
router.delete(
  "/admin/:id",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.deleteEKYC
);

// Admin: Dashboard statistics
router.get(
  "/admin/statistics",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.getEKYCStatistics
);

// Admin: Export E-KYC Data
router.get(
  "/admin/export",
  auth,
  authorizeRole("ADMIN"),
  ekycCtrl.exportEKYCData
);

module.exports = router;
