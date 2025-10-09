const User = require("../model/user");
const janArogyaApply = require("../model/janArogyaApply");
const JanArogyaApply = require("../model/janArogyaApply");
const { uploadToCloudinary } = require("../utils/imageUploader");

// Internal builder (for self or on behalf)
const buildApplication = async (req, res) => {
  try {
    const {
      applicationId,
      enrollmentNo,
      submissionDate,
      title,
      name,
      aadhaar,
      phone,
      email,
      dob,
      gender,
      married,
      address,
      educationalQualifications,
      currentOccupation,
      currentEmployer,
      designation,
      previousWorkExperience,
      businessDetails,
      professionalBackground,
      professionalAssociations,
      businessStructure,
      existingEntity,
      existingEntityName,
      proposedCity,
      proposedState,
      setupTimeline,
      sitePossession,
      siteDetails,
      siteInMind,
      planToRent,
      withinMonths,
      investmentRange,
      effortsInitiatives,
      reasonsForPartnership,
      category,
      relevantExperience,
    } = req.body;

    const { idProof, qualificationCertificate, financialStatement } =
      req.files || {};

    // Check duplicate aadhaar
    const existing = await JanArogyaApply.findOne({ aadhaar });
    if (existing) {
      return res.status(400).json({ message: "User Already Applied" });
    }

    const application = new JanArogyaApply({
      applicationId,
      enrollmentNo,
      submissionDate,
      title,
      name,
      aadhaar,
      phone,
      email,
      dob,
      gender,
      married,
      address,
      educationalQualifications: educationalQualifications
        ? JSON.parse(educationalQualifications)
        : [],
      currentOccupation,
      currentEmployer,
      designation,
      
      previousWorkExperience: previousWorkExperience
        ? JSON.parse(previousWorkExperience)
        : [],
      businessDetails: businessDetails ? JSON.parse(businessDetails) : [],
      professionalBackground: professionalBackground
        ? JSON.parse(professionalBackground)
        : [],
      professionalAssociations,
      businessStructure,
      existingEntity,
      existingEntityName,
      proposedCity,
      proposedState,
      setupTimeline,
      sitePossession,
      siteDetails: siteDetails ? JSON.parse(siteDetails) : {},
      siteInMind,
      planToRent,
      withinMonths,
      investmentRange,
      effortsInitiatives,
      reasonsForPartnership,
      category,
      relevantExperience,
      appliedBy: req.user._id,
    });

    // File uploads
    if (idProof) {
      const image = await uploadToCloudinary(
        idProof,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      application.idProof = image.secure_url;
    }

    if (qualificationCertificate) {
      const image = await uploadToCloudinary(
        qualificationCertificate,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      application.qualificationCertificate = image.secure_url;
    }

    if (financialStatement) {
      const image = await uploadToCloudinary(
        financialStatement,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      application.financialStatement = image.secure_url;
    }

    await application.save();
    return res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (err) {
    console.error("Error in buildApplication:", err);
    return res
      .status(500)
      .json({ message: "Error applying", error: err.message });
  }
};

// Wrappers
exports.userApply = (req, res) => buildApplication(req, res);
exports.employeeApply = (req, res) => buildApplication(req, res);
exports.adminOfflineApply = (req, res) => buildApplication(req, res);
// USER: Get own applications (applications for them)
exports.getMyApplications = async (req, res) => {
  try {
    const aadhaar = req.body.aadhar;
    const apps = await JanArogyaApply.find({
      aadhaar,
      status: "APPROVED",
    }).populate("appliedBy", "name email role");
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching user applications",
        error: err.message,
      });
  }
};

// EMPLOYEE: Get applications they submitted for users
exports.getEmployeeApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApply.find({
      appliedBy: req.user._id,
    }).populate("forUser", "name email role");
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching employee applications",
        error: err.message,
      });
  }
};

// ADMIN: Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApply.find();

    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all applications", error: err.message });
  }
};
exports.getApprovedApplications = async (req, res) => {
  try {
    // Find only applications where status is "approved"
    const approvedApps = await JanArogyaApply.find({ status: "APPROVED" });

    res.json(approvedApps);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching approved applications",
        error: err.message,
      });
  }
};

exports.checkJanarogyaApply = async (req, res) => {
  try {
    const id = req.query.id; // 👈 GET query se aayega
    const userId = req.user.id;

    let application;

    if (id) {
      application = await janArogyaApply.findById(id);
    } else {
      application = await janArogyaApply.findOne({ appliedBy: userId });
    }

    if (application && application.status === "PENDING") {
      return res.status(200).json({
        msg: "USER ALREADY EXISTS",
        application,
        status: true,
        
      });
    }

    if (application && application.status === "APPROVED") {
      return res.status(200).json({
        msg: "APPROVED",
        application,
        status: true,
      });
    }

    return res.status(404).json({ msg: "USER NOT FOUND", status: false });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
// ADMIN: Update status
exports.updateJanArogyaStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await JanArogyaApply.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Status updated successfully", app });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
};
exports.employeeupdateJanArogyaStatus = async (req, res) => {
  try {
    const { phone } = req.body; // this is the forUser's id
    console.log(phone);
    const app = await JanArogyaApply.findOneAndUpdate(
      { phone: phone }, // filter by forUser
      { status: "WITHDRAWN" }, // update
      { new: true } // return updated doc
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated successfully", app });
  } catch (err) {
    res.status(500).json({
      message: "Error updating status",
      error: err.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, aadhaar } = req.body;
    console.log(aadhaar, paymentId);
    if (!paymentId || !aadhaar) {
      return res
        .status(400)
        .json({ message: "aadhaar and paymentId are required" });
    }

    // Find the application
    const application = await JanArogyaApply.findOne({ aadhaar });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Upload screenshot to Cloudinary if present
    let screenshotUrl = "";
    if (req.file) {
      const image = await uploadToCloudinary(
        req.file,
        process.env.FOLDER_NAME || "janArogyaPayments",
        1000,
        1000
      );
      screenshotUrl = image.secure_url;
    }

    // Update payment details
    application.payment = {
      paymentId,
      screenshotUrl,
      paid: true,
    };
    // application.status = ;

    await application.save();

    res
      .status(200)
      .json({ message: "Payment verified successfully", application });
  } catch (err) {
    console.error("Payment verification error:", err);
    res
      .status(500)
      .json({ message: "Error verifying payment", error: err.message });
  }
};
