// models/aboutPageModel.js
const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  title: String,
  icon: String,
  text: String,
});

const aboutSchema = new mongoose.Schema({
  subtitle: { type: String, required: true },
  heading: { type: String, required: true },
  shortText: { type: String, required: true },
  paragraphs: [String], // multiple paragraphs
  image: { type: String, required: true },
  missionItems: [missionSchema], // cards list
});

module.exports = mongoose.model("AboutPage", aboutSchema);
