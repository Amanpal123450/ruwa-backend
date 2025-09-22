const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

// CRUD routes
router.get("/", serviceController.getServices);
router.post("/", serviceController.createService);
router.put("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

module.exports = router;
