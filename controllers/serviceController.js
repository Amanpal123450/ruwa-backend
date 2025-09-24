const Service = require("../model/serviceSchema");
const { uploadToCloudinary } = require("../utils/imageUploader");

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create service
exports.createService = async (req, res) => {
  try {
    const { title, description ,icon} = req.body;
  

    if (!title || !description || !icon) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    

    const service = new Service({
      title,
      description,
      icon
    });

    await service.save();
    res.status(201).json({ message: "Service created successfully", service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { icon } = req.files || {};

    let updateData = { title, description };

    if (icon) {
      const uploadedIcon = await uploadToCloudinary(
        icon,
        process.env.FOLDER_NAME,
        300,
        300
      );
      updateData.icon = uploadedIcon.secure_url;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service updated successfully", service });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
