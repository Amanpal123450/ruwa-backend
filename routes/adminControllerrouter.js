const express = require("express");
const router = express.Router();
const {getAdminDashboardStats}= require("../controllers/adminControllerDashboard");
const { auth, authorizeRole } = require("../middlewares/auth");


router.get("/Admin/data",auth,authorizeRole("ADMIN") ,getAdminDashboardStats);

module.exports = router;