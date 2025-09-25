const express = require("express");
const router = express.Router();
const {
   userApplySwabhiman,
   employeeApplySwabhiman,
   getMySwabhimanApplications,
   getEmployeeSwabhimanApplications,
   getAllSwabhimanApplications,
   updateSwabhimanStatus,
   employeeUpdateSwabhimanStatus,
   verifySwabhimanPayment,
   checkSwabhimanApply
} = require("../controllers/sevaController");

const { auth, authorizeRole } = require("../middlewares/auth");
// const multer = require("multer");

// Multer configuration for file uploads
// const upload = multer({ storage: multer.memoryStorage() });

// Payment verification route
// router.post("/verify-payment", 
//    auth, 
//    authorizeRole("EMPLOYEE", "USER"), 
// //    upload.single("screenshot"), // For payment screenshot
//    verifySwabhimanPayment
// );

// USER applies for themselves
router.post(
   "/apply",
   auth,
   authorizeRole("USER"),
//    upload.single("idProof"), // For ID proof upload
   userApplySwabhiman
);

// EMPLOYEE applies on behalf of user
router.post(
   "/employee/apply",
   auth,
   authorizeRole("EMPLOYEE"),
   // upload.single("idProof"), // For ID proof upload
   employeeApplySwabhiman
);

// Check application status
router.get("/check", auth, checkSwabhimanApply);

// USER: Get their own applications
router.get("/my-applications", 
   auth, 
   authorizeRole("USER"), 
   getMySwabhimanApplications
);

// EMPLOYEE: Get applications they submitted
router.get("/employee/applications", 
   auth, 
   authorizeRole("EMPLOYEE"), 
   getEmployeeSwabhimanApplications
);

// ADMIN: Get all applications
router.get("/admin/all", 
   auth, 
   authorizeRole("ADMIN"), 
   getAllSwabhimanApplications
);

// ADMIN: Update application status
router.put("/:id/status", 
   auth, 
   authorizeRole("ADMIN"), 
   updateSwabhimanStatus
);

// EMPLOYEE: Withdraw application
router.put("/withdrawn", 
   auth, 
   authorizeRole("EMPLOYEE"), 
   employeeUpdateSwabhimanStatus
);

module.exports = router;