// routes/featuresRoutes.js
const express = require("express");
const router = express.Router();
const featuresController = require("../../controllers/aboutPageController/aboutPageFeature");

router.get("/", featuresController.getFeatures);
router.post("/", featuresController.createFeatures);
router.put("/", featuresController.updateFeatures);

module.exports = router;
