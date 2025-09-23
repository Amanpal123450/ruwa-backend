// controllers/featuresController.js
const FeaturesPage = require("../../model/aboutPageModel/aboutPageFeatures");

exports.getFeatures = async (req, res) => {
  try {
    const features = await FeaturesPage.findOne();
    res.json(features);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Features", err });
  }
};

exports.createFeatures = async (req, res) => {
  try {
    const features = new FeaturesPage(req.body);
    await features.save();
    res.status(201).json(features);
  } catch (err) {
    res.status(500).json({ message: "Error creating Features", err });
  }
};

exports.updateFeatures = async (req, res) => {
  try {
    const updated = await FeaturesPage.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating Features", err });
  }
};

// controllers/featuresController.js

exports.deleteFeaturesById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeaturesPage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Features not found" });
    }
    res.json({ message: "Features deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting Features", err });
  }
};

