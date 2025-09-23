const express = require("express");
const router = express.Router();
const slideController = require("../controllers/slidesController");
const { authorizeRole,auth } = require("../middlewares/auth");

router.get("/",auth,authorizeRole("ADMIN"), slideController.getSlides);
router.post("/",auth,authorizeRole("ADMIN"), slideController.createSlide);
router.put("/:id",auth,authorizeRole("ADMIN"), slideController.updateSlide);
router.delete("/:id",auth,authorizeRole("ADMIN"), slideController.deleteSlide);

module.exports = router;
