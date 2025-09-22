// models/featuresModel.js
const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
  icon: String,
  title: String,
  text: String,
});

const featuresPageSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  features: [featureSchema], // 4 feature cards
});

module.exports = mongoose.model("FeaturesPage", featuresPageSchema);
