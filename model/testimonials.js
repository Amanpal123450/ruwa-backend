const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  message: { type: String, required: true }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
