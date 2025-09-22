const Slide = require("../model/slidesSchema");
const Testimonial = require("../model/testimonials");
const Service = require("../model/serviceSchema");
const Hero = require("../model/hero");

exports.getHomepageData = async (req, res) => {
  try {
    const slides = await Slide.find();
    const testimonials = await Testimonial.find();
    const services = await Service.find();
    const hero = await Hero.findOne();

    res.json({
      success: true,
      slides,
      testimonials,
      services,
      hero
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
