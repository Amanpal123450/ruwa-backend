const express = require("express");
const router = express.Router();
const slideController = require("../controllers/slidesController");

router.get("/", slideController.getSlides);
router.post("/", slideController.createSlide);
router.put("/:id", slideController.updateSlide);
router.delete("/:id", slideController.deleteSlide);

module.exports = router;
