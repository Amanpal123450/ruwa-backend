const express = require("express");
const router = express.Router();
const serviceController = require("../../controllers/servicePageController/serviceCard");
const { auth, authorizeRole } = require("../../middlewares/auth");

// Get all services
router.get("/",auth,authorizeRole("ADMIN"), serviceController.getAllServices);

// Get single service by ID
router.get("/:id",auth,authorizeRole("ADMIN"),  serviceController.getServiceById);

// Add new service (admin)
router.post("/",auth,serviceController.createService);

// Update service by ID (admin)
router.put("/:id",auth,authorizeRole("ADMIN"),  serviceController.updateService);

// Delete service by ID (admin)
router.delete("/:id",auth,authorizeRole("ADMIN"),  serviceController.deleteService);

module.exports = router;
