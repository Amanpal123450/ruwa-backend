const Service = require("../../model/servicesPageModel/serviceFeatures");

// GET all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST create new service
exports.createService = async (req, res) => {
  try {
    console.log(req.body)
    const service = new Service({
      icon: req.body.icon,
      title: req.body.title,
      description: req.body.description,
    });
     await service.save();
    res.status(201).json({ success: true, service });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message, errors: error.errors });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT update service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
