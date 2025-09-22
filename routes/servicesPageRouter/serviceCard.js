const express = require("express");
const router = express.Router();
const serviceController = require("../../controllers/servicePageController/serviceCard");

// Get all services
router.get("/", serviceController.getAllServices);

// Get single service by ID
router.get("/:id", serviceController.getServiceById);

// Add new service (admin)
router.post("/", serviceController.createService);

// Update service by ID (admin)
router.put("/:id", serviceController.updateService);

// Delete service by ID (admin)
router.delete("/:id", serviceController.deleteService);

module.exports = router;
