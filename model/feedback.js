const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    approved: { type: Boolean, default: false }, // 👈 new field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
