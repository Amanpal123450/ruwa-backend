const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const {auth,authorizeRole} = require("../middlewares/auth"); // your JWT auth

// Only admin can assign
router.post("/assign", auth,authorizeRole("ADMIN"), taskController.assignTask);

// Employee APIs
router.get("/today",auth,authorizeRole("EMPLOYEE"), taskController.getTodaysTasks);
router.put("/:id/complete", auth,authorizeRole("EMPLOYEE"), taskController.completeTask);
router.get("/performance",auth,authorizeRole("EMPLOYEE"), taskController.getPerformance);

module.exports = router;
