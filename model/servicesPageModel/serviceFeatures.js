const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  icon: { type: String, required: true }, 
  title: { type: String, required: true },
  description: { type: String }, 
}, { timestamps: true });

const Service = mongoose.model("ServiceFeatures", serviceSchema);

module.exports = Service;
