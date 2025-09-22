const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  icon: { type: String, required: true }, // Store icon as HTML string
  title: { type: String, required: true },
  description: { type:String, required: true }, // Array of strings
}, { timestamps: true });

const Service = mongoose.models.Service || mongoose.model("ServiceFeatures", serviceSchema);

module.exports = Service;
