const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
  buttonLink: { type: String, required: true },
  btnClass: { type: String, required: true }, // btn-info, btn-danger, etc.
}, { timestamps: true });

module.exports = mongoose.model("ServiceCard", serviceSchema);
