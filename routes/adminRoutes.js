const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getProfile, updateProfile,createEmployee,getAllEmployees,deleteEmployee,getAllUser, updateEmployee, getEmployeeById, getEmployeeAttendance, getAdminEmployeeAppliedUsers, getAdminUserServices, createVendor } = require("../controllers/adminController");
const { auth, authorizeRole } = require("../middlewares/auth");




// Route -> GET /api/users/employees
router.get("/employees",auth,authorizeRole("ADMIN") ,getAllEmployees);
router.get("/employee/:id",auth,authorizeRole("ADMIN"), getEmployeeById);
router.get("/applied-by/:employeeId",auth,authorizeRole("ADMIN"), getAdminEmployeeAppliedUsers);
router.get("/applied-phone/:phone",auth,authorizeRole("ADMIN"), getAdminUserServices);
router.get("/employee/:id/attendance", auth,authorizeRole("ADMIN"), getEmployeeAttendance);

// Update Employee
router.put(
  "/employee/:id",
  auth,
  authorizeRole("ADMIN"),
  updateEmployee
);

// Admin creates employee
router.delete(
  "/employee/:id",
  auth,
  authorizeRole("ADMIN"),
  deleteEmployee
);
// ADMIN ROUTE → saare users ke applications

router.get(
  "/admin/users",
  auth,
  authorizeRole("ADMIN"),
  getAllUser
);


router.post("/create", auth,authorizeRole("ADMIN"), createEmployee);
router.post("/createVendor", auth, authorizeRole("ADMIN"), createVendor);
// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get Profile
router.get("/profile", auth, authorizeRole('ADMIN'), getProfile);

// Update Profile with image upload
router.put("/update-profile", auth, authorizeRole('ADMIN'), upload.single("profile_pic"), updateProfile);

module.exports = router;
