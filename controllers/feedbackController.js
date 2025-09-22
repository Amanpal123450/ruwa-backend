const Feedback = require("../model/feedback");

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
exports.submitFeedback = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    if (!name || !message || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = new Feedback({
      name,
      message,
      rating,
      approved: false, // default false
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully, waiting for admin approval",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all approved feedbacks (for public)
// @route   GET /api/feedback
// @access  Public
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Approve a feedback
// @route   PUT /api/feedback/:id/approve
// @access  Admin
exports.approveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.approved = true;
    await feedback.save();

    res.status(200).json({ message: "Feedback approved successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all feedbacks (approved + pending) for admin
// @route   GET /api/feedback/admin/all
// @access  Admin
exports.getAllFeedbacksAdmin = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
