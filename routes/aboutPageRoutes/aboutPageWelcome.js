// routes/aboutRoutes.js
const express = require("express");
const router = express.Router();
const aboutController = require("../../controllers/aboutPageController/aboutPagewelcome");

router.get("/", aboutController.getAbout);
router.post("/", aboutController.createAbout);
router.put("/", aboutController.updateAbout);

module.exports = router;
