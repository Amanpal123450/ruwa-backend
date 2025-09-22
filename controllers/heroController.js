const Hero = require("../model/hero");
const { uploadToCloudinary } = require("../utils/imageUploader");

// Get hero section
exports.getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create hero (only if not exists yet)
exports.createHero = async (req, res) => {
  try {
    const { subtitle, title, paragraph1, paragraph2 } = req.body;
    const { heroImage } = req.files || {};

    if (!title || !subtitle || !paragraph1 || !heroImage) {
      return res.status(400).json({ message: "Title, subtitle, paragraph1, and heroImage are required" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadToCloudinary(
      heroImage,
      process.env.FOLDER_NAME,
      1200,
      800
    );

    const hero = new Hero({
      subtitle,
      title,
      paragraph1,
      paragraph2,
      heroImage: uploadedImage.secure_url,
    });

    await hero.save();
    res.status(201).json({ message: "Hero section created successfully", hero });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update hero (or create if none exists)
exports.updateHero = async (req, res) => {
  try {
    const { subtitle, title, paragraph1, paragraph2 } = req.body;
    const { heroImage } = req.files || {};

    let updateData = { subtitle, title, paragraph1, paragraph2 };

    if (heroImage) {
      const uploadedImage = await uploadToCloudinary(
        heroImage,
        process.env.FOLDER_NAME,
        1200,
        800
      );
      updateData.heroImage = uploadedImage.secure_url;
    }

    const hero = await Hero.findOneAndUpdate({}, updateData, { new: true, upsert: true });

    res.json({ message: "Hero section updated successfully", hero });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete hero (since only one should exist)
exports.deleteHero = async (req, res) => {
  try {
    await Hero.deleteMany();
    res.json({ message: "Hero section deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
