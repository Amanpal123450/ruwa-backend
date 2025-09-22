const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const { auth, authorizeRole } = require("../middlewares/auth");

// POST feedback
router.post("/", feedbackController.submitFeedback);

// GET all feedbacks
router.get("/", feedbackController.getAllFeedbacks);

router.put(
  "/:id/approve",
  auth,
  authorizeRole("ADMIN"),
  feedbackController.approveFeedback
);

// Get all feedbacks (approved + pending) for Admin
router.get(
  "/admin/all",
  auth,
  authorizeRole("ADMIN"),
  feedbackController.getAllFeedbacksAdmin
);

router.delete(
  "/:id",
  auth,
  authorizeRole("ADMIN"),
  feedbackController.deleteFeedback
);

module.exports = router;
