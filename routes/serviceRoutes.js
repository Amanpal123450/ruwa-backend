const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { auth, authorizeRole } = require("../middlewares/auth");

// CRUD routes
router.get("/",auth,authorizeRole("ADMIN"), serviceController.getServices);
router.post("/",auth,authorizeRole("ADMIN") ,serviceController.createService);
router.put("/:id",auth,authorizeRole("ADMIN"), serviceController.updateService);
router.delete("/:id",auth,authorizeRole("ADMIN"), serviceController.deleteService);

module.exports = router;
