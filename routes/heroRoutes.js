const express = require("express");
const router = express.Router();
const heroController = require("../controllers/heroController");
const { auth, authorizeRole } = require("../middlewares/auth");

// Since only one hero exists
router.get("/",auth,authorizeRole("ADMIN"), heroController.getHero);
router.post("/", auth,authorizeRole("ADMIN"),heroController.createHero);
router.put("/",auth,authorizeRole("ADMIN"), heroController.updateHero);
router.delete("/",auth,authorizeRole("ADMIN"), heroController.deleteHero);

module.exports = router;
