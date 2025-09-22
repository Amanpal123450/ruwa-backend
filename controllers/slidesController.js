const Slide =require("../model/slidesSchema")

exports.getSlides = async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSlide = async (req, res) => {
  try {
    const slide = new Slide(req.body);
    await slide.save();
    res.json(slide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(slide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSlide = async (req, res) => {
  try {
    await Slide.findByIdAndDelete(req.params.id);
    res.json({ message: "Slide deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
