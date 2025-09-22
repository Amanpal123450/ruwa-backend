const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialsController");

// CRUD routes
router.get("/", testimonialController.getTestimonials);
router.post("/", testimonialController.createTestimonial);
router.put("/:id", testimonialController.updateTestimonial);
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;
