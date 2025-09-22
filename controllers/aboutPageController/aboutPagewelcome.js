// controllers/aboutController.js
const AboutPage = require("../../model/aboutPageModel/aboutPagewelcome");

exports.getAbout = async (req, res) => {
  try {
    const about = await AboutPage.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: "Error fetching About data", err });
  }
};

exports.createAbout = async (req, res) => {
  try {
    const about = new AboutPage(req.body);
    await about.save();
    res.status(201).json(about);
  } catch (err) {
    res.status(500).json({ message: "Error creating About", err });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const updated = await AboutPage.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating About", err });
  }
};
