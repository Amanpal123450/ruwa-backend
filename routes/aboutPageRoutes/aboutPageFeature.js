// routes/featuresRoutes.js
const express = require("express");
const router = express.Router();
const featuresController = require("../../controllers/aboutPageController/aboutPageFeature");
const { auth, authorizeRole } = require("../../middlewares/auth");

<<<<<<< HEAD
router.get("/",featuresController.getFeatures);
=======
router.get("/", featuresController.getFeatures);
>>>>>>> e2dbd1639e7fd9e3fc91d9cc2bbf9ad0f6741304
router.post("/",auth,authorizeRole("ADMIN"), featuresController.createFeatures);
router.put("/",auth,authorizeRole("ADMIN"), featuresController.updateFeatures);
router.delete("/:id",auth,authorizeRole("ADMIN"), featuresController.deleteFeaturesById);


module.exports = router;
