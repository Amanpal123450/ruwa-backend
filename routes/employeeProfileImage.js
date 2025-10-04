const express = require("express");
const router = express.Router();
const {getProfile,updateProfile,uploadProfileImage, uploadDOB} = require("../controllers/employeeProfileImage");
const { auth, authorizeRole } = require("../middlewares/auth");


router.get("/profile", auth,  authorizeRole("EMPLOYEE" , "USER"), getProfile);
router.put("/profile", auth,  authorizeRole("EMPLOYEE", "USER"),updateProfile);
router.post("/upload-profile", auth, authorizeRole("EMPLOYEE" , "USER"), uploadProfileImage);
// router.put("/upload-DOB",auth, authorizeRole("EMPLOYEE","USER"),uploadDOB);
module.exports = router;