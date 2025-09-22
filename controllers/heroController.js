const Hero = require("../model/hero");

// Get hero section
exports.getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create hero (if not exists)
exports.createHero = async (req, res) => {
  try {
    const hero = new Hero(req.body);
    await hero.save();
    res.json(hero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update hero
exports.updateHero = async (req, res) => {
  try {
    const hero = await Hero.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(hero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete hero
exports.deleteHero = async (req, res) => {
  try {
    await Hero.deleteMany(); // since only one hero should exist
    res.json({ message: "Hero section deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
