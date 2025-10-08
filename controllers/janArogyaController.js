// const janArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApplication = require("../model/janArogyaApplication");
const user = require("../model/user");
const { uploadToCloudinary } = require("../utils/imageUploader");
const { sendEmail } = require("../utils/sendEmail");
 // same utility you use in createEmployee
const QRCode = require("qrcode");
const buildApplication = async (req, res) => {
  try {
    const { name, aadhar, mobile, state, district, DOB, gender, email } =
      req.body;
    const { income_certificate, caste_certificate, ration_id, profilePicUser } =
      req.files || {};

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
      email,
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
    if (qrCodeUrl) {
      app.Qr = qrCodeUrl;
    }
    await app.save();
    res.status(201).json({ message: "Application submitted", app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying", error: err.message });
  }
};

// USER applies for self
exports.userApplyJanarogya = (req, res) => buildApplication(req, res);

// EMPLOYEE applies for others
exports.applyJanarogya = async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ FILES:", req.files);

  return buildApplication(req, res);
};

exports.checkJanarogya = async (req, res) => {
  try {
    const id = req.query.id; // 👈 GET query se aayega
    const userId = req.user.id;

    let application;

    if (id) {
      application = await JanArogyaApplication.findById(id);
    } else {
      application = await JanArogyaApplication.findOne({ appliedBy: userId });
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



// USER: Get own applications
exports.getUserApplication = async (req, res) => {
  const id = req.user.id;
  try {
    const apps = await JanArogyaApplication.find({ appliedBy: id,status:"APPROVED"  });
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
    const apps = await JanArogyaApplication.find();
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
    
    if (req.body.status.toLowerCase() === "approved") {
      const subject = "🎉 Your Jan Arogya Card Application is Approved";
      
      const message = `
  <h2>Dear ${app.name},</h2>
  <p>Congratulations! 🎉</p>
  <p>Your Jan Arogya Card application (<strong>ID: ${app._id}</strong>) has been <b>approved</b>.</p>
  <p>Your health card will be processed and delivered soon.</p>

  <h3>Next Steps:</h3>
  <ul>
    <li>Please keep your application ID safe for future reference.</li>
    <li>You’ll receive a notification once your card is ready.</li>
  </ul>

  <p>Thank you for choosing Jan Arogya Kendra.</p>
  <p><b>Regards,</b><br>Jan Arogya Kendra Team</p>
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
      { mobile: phone }, // filter by forUser
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
