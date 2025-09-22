const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  subtitle: String,
  title: String,
  paragraph1: String,
  paragraph2: String,
  heroImage: String
});

module.exports = mongoose.model("Hero", heroSchema);
