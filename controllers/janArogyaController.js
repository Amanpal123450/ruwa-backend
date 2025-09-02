// const janArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApplication = require("../model/janArogyaApplication");
const { uploadToCloudinary } = require("../utils/imageUploader");

const buildApplication = async (req, res, forUserId) => {
  try {
    const {
      name,
      aadhar,
      mobile,
      state,
      district,
      forUserId,
    } = req.body;
    const { income_certificate, caste_certificate, ration_id } = req.files || {};


    if (!forUserId)
      return res.status(400).json({ message: "forUserId is required" });

    const existing = await JanArogyaApplication.findOne({ aadhar });
    if (existing) return res.status(400).json({ message: "Already applied." });

    const app = new JanArogyaApplication({
      name,
      aadhar,
      mobile,
      state,
      district,
      appliedBy: req.user._id,
      forUser: forUserId,
    });

    if (income_certificate) {
      const image = await uploadToCloudinary(
        income_certificate,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      app.income_certificate = image.secure_url;
    }
    if (caste_certificate) {
      const image = await uploadToCloudinary(
        caste_certificate,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      app.caste_certificate = image.secure_url;
    }
    if (ration_id) {
      const image = await uploadToCloudinary(
        ration_id,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      app.ration_id = image.secure_url;
    }
    await app.save();
    res.status(201).json({ message: "Application submitted", app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying", error: err.message });
  }
};

// USER applies for self
exports.userApplyJanarogya = (req, res) =>
  buildApplication(req, res, req.user.id);

// EMPLOYEE applies for others
exports.applyJanarogya = async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ FILES:", req.files);

  const forUserId = req.body.forUserId || req.body.foruserid;
  if (!forUserId) {
    return res.status(400).json({ message: "forUserId is required" });
  }

  return buildApplication(req, res, forUserId);
};

exports.checkJanarogya = async (req, res) => {
  try {
    const { userId } = req.user; // coming from auth middleware

    // If application schema stores user reference as `userId`
    const application = await JanArogyaApplication.findOne({ userId }).populate(
      "status"
    );

    if (application && application.status == "PENDING") {
      return res.status(200).json({ msg: "USER ALREADY EXISTS" });
    }
    if (application && application.status == "APPROVED") {
      return res.status(200).json({ msg: "APPROVED" });
    }
    return res.status(404).json({ msg: "USER NOT FOUND" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

// USER: Get own applications
exports.getUserApplication = async (req, res) => {
  try {
    const apps = await JanArogyaApplication.find({ forUser: req.user.id });
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user application", error: err.message });
  }
};

// EMPLOYEE: Get applications submitted by them
exports.getJanarogyaApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApplication.find({
      appliedBy: req.user.id,
    }).populate("forUser", "name email");
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err.message });
  }
};

// ADMIN: Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApplication.find().populate(
      "appliedBy forUser",
      "name role email"
    );
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all applications", error: err.message });
  }
};

// ADMIN: Update status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const app = await JanArogyaApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: "Status updated", app });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
};

// EMPLOYEE/USER: Withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    const app = await JanArogyaApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const isOwner = String(app.appliedBy) === req.user.id;
    const isForUser = String(app.forUser) === req.user.id;
    if (!isOwner && !isForUser) {
      return res.status(403).json({ message: "Not authorized" });
    }

    app.status = "WITHDRAWN";
    await app.save();
    res.json({ message: "Application withdrawn", app });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error withdrawing application", error: err.message });
  }
};
