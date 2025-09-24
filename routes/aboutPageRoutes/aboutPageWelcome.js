// routes/aboutRoutes.js
const express = require("express");
const router = express.Router();
const aboutController = require("../../controllers/aboutPageController/aboutPagewelcome");
const { auth, authorizeRole } = require("../../middlewares/auth");

router.get("/", aboutController.getAbout);
router.post("/",auth,authorizeRole("ADMIN"), aboutController.createAbout);
router.put("/",auth,authorizeRole("ADMIN"), aboutController.updateAbout);
router.delete("/:id",auth,authorizeRole("ADMIN"), aboutController.deleteAboutById);

module.exports = router;
