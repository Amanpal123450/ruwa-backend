const express = require("express");
const router = express.Router();
const {getProfile,updateProfile,uploadProfileImage} = require("../controllers/employeeProfileImage");
const { auth, authorizeRole } = require("../middlewares/auth");


router.get("/profile", auth,  authorizeRole("EMPLOYEE"), getProfile);
router.put("/profile", auth,  authorizeRole("EMPLOYEE"),updateProfile);
router.post("/upload-profile", auth, authorizeRole("EMPLOYEE"), uploadProfileImage);

module.exports = router;