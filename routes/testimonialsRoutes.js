const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialsController");
const { auth, authorizeRole } = require("../middlewares/auth");

// CRUD routes
router.get("/",auth,authorizeRole("ADMIN"), testimonialController.getTestimonials);
router.post("/",auth,authorizeRole("ADMIN"), testimonialController.createTestimonial);
router.put("/:id",auth,authorizeRole("ADMIN"), testimonialController.updateTestimonial);
router.delete("/:id",auth,authorizeRole("ADMIN"), testimonialController.deleteTestimonial);

module.exports = router;
