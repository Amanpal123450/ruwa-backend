const Testimonial = require("../model/testimonials");
const { uploadToCloudinary } = require("../utils/imageUploader");

// Get all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body;
    const { image } = req.files || {};

    if (!name || !message || !image) {
      return res.status(400).json({ message: "Name, message, and image are required" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadToCloudinary(
      image,
      process.env.FOLDER_NAME,
      800,
      800
    );

    const testimonial = new Testimonial({
      name,
      message,
      image: uploadedImage.secure_url,
    });

    await testimonial.save();
    res.status(201).json({ message: "Testimonial created successfully", testimonial });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body;
    const { image } = req.files || {};

    let updateData = { name, message };

    if (image) {
      const uploadedImage = await uploadToCloudinary(
        image,
        process.env.FOLDER_NAME,
        800,
        800
      );
      updateData.image = uploadedImage.secure_url;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ message: "Testimonial updated successfully", testimonial });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
