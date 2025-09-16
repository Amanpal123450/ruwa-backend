// const janArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApplication = require("../model/janArogyaApplication");
const user = require("../model/user");
const { uploadToCloudinary } = require("../utils/imageUploader");
const sendEmail = require("../utils/sendEmail"); // same utility you use in createEmployee
const QRCode = require("qrcode");
const buildApplication = async (req, res) => {
  try {
    const {
      name,
      aadhar,
      mobile,
      state,
      district,
      DOB,
      gender
    } = req.body;
    const { income_certificate, caste_certificate, ration_id,profilePicUser } = req.files || {};


    

    const existing = await JanArogyaApplication.findOne({ aadhar });
    if (existing) return res.status(400).json({ message: "Already applied." });

    const app = new JanArogyaApplication({
      name,
      aadhar,
      mobile,
      state,
      district,
      DOB,
      gender,
      appliedBy: req.user.id,
      
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
  
     if (profilePicUser) {
      const image = await uploadToCloudinary(
        profilePicUser,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      app.profilePicUser = image.secure_url;
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

     const qrData = {
      id: app._id,
      name: app.name,
      gender: app.gender,
      DOB: app.DOB,
      mobile: app.mobile,
      state: app.state,
      district: app.district,
      aadhar: app.aadhar,
    };

    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));
    if(qrCodeUrl)
    {

      app.Qr=qrCodeUrl;
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
  buildApplication(req, res);

// EMPLOYEE applies for others
exports.applyJanarogya = async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ FILES:", req.files);

  
  

  return buildApplication(req, res);
};

exports.checkJanarogya = async (req, res) => {
  try {
    const { userId } = req.user; // coming from auth middleware

    // If application schema stores user reference as `userId`
    const application = await JanArogyaApplication.findOne({ userId }).populate(
      "status"
    );
    // console.log("ds",application)
    if (application && application.status == "PENDING") {
      return res.status(200).json({ msg: "USER ALREADY EXISTS" });
    }
   if (application && application.status == "APPROVED") {
  return res.status(200).json({
    msg: "APPROVED",
    application,
  });
}

    return res.status(404).json({ msg: "USER NOT FOUND" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

// USER: Get own applications
exports.getUserApplication = async (req, res) => {
  const id =req.user.id
  try {
    const apps = await JanArogyaApplication.find({  id });
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
    const apps = await JanArogyaApplication.find()
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all applications", error: err.message });
  }
};

// ADMIN: Update 


exports.updateApplicationStatus = async (req, res) => {
  try {
    console.log("New status:", req.body.status);

    const app = await JanArogyaApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Send email only when status is approved (you can extend for rejected/pending)
    if (req.body.status.toLowerCase() === "approved") {
      const subject = "Your Jan Arogya Card Application is Approved 🎉";
      const message = `
Hello ${app.name},

We are pleased to inform you that your Jan Arogya Card application has been approved.  
You will soon receive your card.

Application ID: ${app._id}
Status: ${app.status}

Thank you for applying with us.

- Jan Arogya Kendra Team
      `;

      if (app.email) {
        await sendEmail(app.email, subject, message);
      }
    }

    res.json({ message: "Status updated", app });
  } catch (err) {
    console.error("Error updating status:", err);
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
};


// EMPLOYEE/USER: Withdraw application

exports.withdrawApplication = async (req, res) => {
  try {
    const phone = req.body; // this is the forUser's id

    const app = await JanArogyaApplication.findOneAndUpdate(
      { mobile: phone },               // filter by forUser
      { status: "WITHDRAWN" },       // update
      { new: true }                  // return updated doc
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