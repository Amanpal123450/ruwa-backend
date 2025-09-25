const swabhimanApplication = require("../model/sevaApplication"); // Updated model name
const { uploadToCloudinary } = require("../utils/imageUploader");

// Internal builder (for self or on behalf)
const buildSwabhimanApplication = async (req, res) => {
  try {
    const {
      fullName,           // Updated from 'name'
      phoneNumber,        // Updated from 'phone'
      aadhaarNumber,      // Updated from 'aadhaar'
      annualFamilyIncome, // New field
      residentialArea,    // New field
      additionalNotes     // New field
    } = req.body;

    const { idProof } = req.files || {}; // Only ID proof is required from frontend

    // Check duplicate aadhaar
    const existing = await swabhimanApplication.findOne({ aadhaarNumber });
    if (existing) {
      return res.status(400).json({ message: "User Already Applied" });
    }

    const application = new swabhimanApplication({
      fullName,
      phoneNumber,
      aadhaarNumber,
      annualFamilyIncome,
      residentialArea,
      additionalNotes,
      appliedBy: req.user._id,
      status: "PENDING" // Default status
    });

    // File upload for ID proof
    if (idProof) {
      const image = await uploadToCloudinary(idProof, process.env.FOLDER_NAME, 1000, 1000);
      application.idProof = image.secure_url;
    }

    await application.save();
    return res.status(201).json({ 
      message: "Jan Swabhiman Card application submitted successfully", 
      application 
    });

  } catch (err) {
    console.error("Error in buildSwabhimanApplication:", err);
    return res.status(500).json({ message: "Error applying", error: err.message });
  }
};

// Wrappers
exports.userApplySwabhiman = (req, res) => buildSwabhimanApplication(req, res);
exports.employeeApplySwabhiman = (req, res) => buildSwabhimanApplication(req, res);

// USER: Get own applications (applications for them)
exports.getMySwabhimanApplications = async (req, res) => {
  try {
    const aadhaarNumber = req.body.aadhaarNumber; // Updated field name
    const apps = await swabhimanApplication.find({ 
      aadhaarNumber, 
      status: "APPROVED" 
    }).populate("appliedBy", "name email role");
    
    res.json(apps);
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching user applications", 
      error: err.message 
    });
  }
};

// EMPLOYEE: Get applications they submitted for users
exports.getEmployeeSwabhimanApplications = async (req, res) => {
  try {
    const apps = await swabhimanApplication.find({ appliedBy: req.user._id })
      .populate("forUser", "name email role");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching employee applications", 
      error: err.message 
    });
  }
};

// ADMIN: Get all applications
exports.getAllSwabhimanApplications = async (req, res) => {
  try {
    const apps = await swabhimanApplication.find();
    res.json(apps);
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching all applications", 
      error: err.message 
    });
  }
};

exports.checkSwabhimanApply = async (req, res) => {
  try {
    const id = req.query.id;
    const userId = req.user.id;

    let application;

    if (id) {
      application = await swabhimanApplication.findById(id);
    } else {
      application = await swabhimanApplication.findOne({ appliedBy: userId });
    }

    if (application && application.status === "PENDING") {
      return res.status(200).json({ msg: "USER ALREADY EXISTS" });
    }

    if (application && application.status === "APPROVED") {
      return res.status(200).json({ msg: "APPROVED", application });
    }

    return res.status(404).json({ msg: "USER NOT FOUND" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

// ADMIN: Update status
exports.updateSwabhimanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await swabhimanApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Status updated successfully", app });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

exports.employeeUpdateSwabhimanStatus = async (req, res) => {
  try {
    const { phoneNumber } = req.body; // Updated field name
    console.log(phoneNumber);
    
    const app = await swabhimanApplication.findOneAndUpdate(
      { phoneNumber: phoneNumber },     // filter by phoneNumber
      { status: "WITHDRAWN" },          // update
      { new: true }                     // return updated doc
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated successfully", app });
  } catch (err) {
    res.status(500).json({
      message: "Error updating status",
      error: err.message
    });
  }
};

exports.verifySwabhimanPayment = async (req, res) => {
  try {
    const { aadhaarNumber, paymentId } = req.body; // Updated field name
    console.log(aadhaarNumber, paymentId);
    
    if (!paymentId || !aadhaarNumber) {
      return res.status(400).json({ 
        message: "aadhaarNumber and paymentId are required" 
      });
    }

    // Find the application
    const application = await swabhimanApplication.findOne({ aadhaarNumber });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Upload screenshot to Cloudinary if present
    let screenshotUrl = "";
    if (req.file) {
      const image = await uploadToCloudinary(
        req.file,
        process.env.FOLDER_NAME || "swabhimanPayments", // Updated folder name
        1000,
        1000
      );
      screenshotUrl = image.secure_url;
    }

    // Update payment details
    application.payment = {
      paymentId,
      screenshotUrl,
      paid: true
    };

    await application.save();

    res.status(200).json({ 
      message: "Payment verified successfully", 
      application 
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ 
      message: "Error verifying payment", 
      error: err.message 
    });
  }
};