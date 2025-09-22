const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  src: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  icon: { type: String }
});

module.exports = mongoose.model("Slide", slideSchema);
