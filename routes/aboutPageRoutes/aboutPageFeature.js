// routes/featuresRoutes.js
const express = require("express");
const router = express.Router();
const featuresController = require("../../controllers/aboutPageController/aboutPageFeature");
const { auth, authorizeRole } = require("../../middlewares/auth");




router.get("/", featuresController.getFeatures);

router.post("/",auth,authorizeRole("ADMIN"), featuresController.createFeatures);
router.put("/",auth,authorizeRole("ADMIN"), featuresController.updateFeatures);
router.delete("/:id",auth,authorizeRole("ADMIN"), featuresController.deleteFeaturesById);


module.exports = router;
