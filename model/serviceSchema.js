const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model("Service", serviceSchema);
