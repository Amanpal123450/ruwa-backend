const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  sliders: [
    {
      imageUrl: { type: String, required: true },
      title: String,
      description: String,
    },
  ],
  section: {
    imageUrl: { type: String, required: true },
    title: String,
    paragraph: String,
    buttonText: String,
    buttonLink: String,
  },
  cards: [
    {
      heading: { type: String, required: true },
      paragraph: String,
      buttonText: String,
      buttonLink: String,
    },
  ],
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);
module.exports = Dashboard;
