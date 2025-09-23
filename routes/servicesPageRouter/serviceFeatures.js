const express = require("express");
const router = express.Router();
const serviceController = require("../../controllers/servicePageController/serviceFeatures");

const {auth, authorizeRole } = require("../../middlewares/auth");

// CRUD Routes
router.get("/",auth,authorizeRole("ADMIN"), serviceController.getAllServices);
router.get("/:id", auth,authorizeRole("ADMIN"),serviceController.getServiceById);
router.post("/p",auth,authorizeRole("ADMIN"), serviceController.createService);
router.put("/:id",auth,authorizeRole("ADMIN"), serviceController.updateService);
router.delete("/:id",auth,authorizeRole("ADMIN"), serviceController.deleteService);

module.exports = router;
