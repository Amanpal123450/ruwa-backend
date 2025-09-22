const Slide =require("../model/slidesSchema")
const { uploadToCloudinary } = require("../utils/imageUploader"); // assuming you have this helper
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
    const { title, text, icon } = req.body;
    const { src } = req.files || {}; // expecting `src` as uploaded image

    if (!title || !text || !src) {
      return res.status(400).json({ message: "Title, text, and image are required" });
    }

    let imageUrl = "";
    if (src) {
      // Upload to Cloudinary
      const uploadedImage = await uploadToCloudinary(
        src,
        process.env.FOLDER_NAME,
        1200, // width
        800   // height
      );
      imageUrl = uploadedImage.secure_url;
    }

    // Save slide in DB
    const slide = new Slide({
      src: imageUrl,
      title,
      text,
      icon,
    });

    await slide.save();

    res.status(201).json({ message: "Slide created successfully", slide });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateSlide = async (req, res) => {
  try {
    const { title, text, icon } = req.body;
    const { src } = req.files || {};

    let updateData = { title, text, icon };

    // If a new image is uploaded, replace the old one
    if (src) {
      const uploadedImage = await uploadToCloudinary(
        src,
        process.env.FOLDER_NAME,
        1200,
        800
      );
      updateData.src = uploadedImage.secure_url;
    }

    const slide = await Slide.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    res.json({ message: "Slide updated successfully", slide });
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
