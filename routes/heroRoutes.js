const express = require("express");
const router = express.Router();
const heroController = require("../controllers/heroController");

// Since only one hero exists
router.get("/", heroController.getHero);
router.post("/", heroController.createHero);
router.put("/", heroController.updateHero);
router.delete("/", heroController.deleteHero);

module.exports = router;
