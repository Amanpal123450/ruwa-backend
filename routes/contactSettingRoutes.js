const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactSettingController");
const { auth, authorizeRole } = require("../middlewares/auth");

// GET contact (frontend will use this)
router.get("/", contactController.getContact);

// POST new contact (admin only)
router.post("/",auth,authorizeRole("ADMIN"), contactController.createContact);

// PUT update contact (admin updates info)
router.put("/",auth,authorizeRole("ADMIN"), contactController.updateContact);

module.exports = router;
