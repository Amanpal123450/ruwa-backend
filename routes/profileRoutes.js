const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const {auth,authorizeRole} = require("../middlewares/auth");

// Get profile
router.get("/summary", auth,authorizeRole("USER"), getProfile);

// Update profile
router.put("/put",  auth,authorizeRole("USER"), updateProfile);

module.exports = router;
