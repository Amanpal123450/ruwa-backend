const ApplyInsurance = require("../model/applyInsurance");
const { uploadToCloudinary } = require("../utils/imageUploader");

// Common apply logic
const buildInsuranceApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullName, dob, gender, email, phoneNumber,
      aadhaarNumber, address, state, district,
      pincode, insuranceType
    } = req.body;

    const {id_proof,passport_photo,medical_documents,income_certificate} = req.files || {};
     const existing=await ApplyInsurance.findOne({aadhaarNumber})
     if(existing){
      return res.status(400).json({message:"Already Applied For Insurance Please Wait For Admin"})
     }
    const app = new ApplyInsurance({
      fullName,
      dob,
      gender,
      email,
      phoneNumber,
      aadhaarNumber,
      address,
      state,
      district,
      pincode,
      insuranceType,
      appliedBy: userId,
      // forUser: forUserId,
      // id_proof: req.files?.id_proof?.[0]?.buffer,
      // passport_photo: req.files?.passport_photo?.[0]?.buffer,
      // medical_documents: req.files?.medical_documents?.[0]?.buffer,
      // income_certificate: req.files?.income_certificate?.[0]?.buffer,
    });

    if (id_proof) {
          const image = await uploadToCloudinary(
            id_proof,
            process.env.FOLDER_NAME,
            1000,
            1000
          );
          app.id_proof = image.secure_url;
        }

         if (passport_photo) {
          const image = await uploadToCloudinary(
            passport_photo,
            process.env.FOLDER_NAME,
            1000,
            1000
          );
          app.passport_photo = image.secure_url;
        }

         if (medical_documents) {
          const image = await uploadToCloudinary(
            medical_documents,
            process.env.FOLDER_NAME,
            1000,
            1000
          );
          app.medical_documents = image.secure_url;
        }

         if (income_certificate) {
          const image = await uploadToCloudinary(
            income_certificate,
            process.env.FOLDER_NAME,
            1000,
            1000
          );
          app.income_certificate = image.secure_url;
        }


    await app.save();
    res.status(201).json({ message: "Insurance application submitted", app });
  } catch (err) {
    res.status(500).json({ message: "Error applying for insurance", error: err.message });
  }
};

// USER applies for self
exports.userApplyInsurance = async (req, res) => {
  return buildInsuranceApplication(req, res);
};

// EMPLOYEE applies for others
exports.applyInsurance = async (req, res) => {
  // const { forUserId } = req.body;
  // if (!forUserId) return res.status(400).json({ message: "forUserId is required" });
  return buildInsuranceApplication(req, res);
};

exports.checkJanarogya = async (req, res) => {
  try {
    const id = req.query.id; // 👈 GET query se aayega
    const userId = req.user.id;

    let application;

    if (id) {
      application = await JanArogyaApplication.findById(id);
    } else {
      application = await ApplyInsurance.findOne({ appliedBy: userId });
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

    return res.status(404).json({
      msg: "USER NOT FOUND",
      status: false,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

// USER: Get own applications
exports.getUserInsuranceApplications = async (req, res) => {
  try {
    const aadhaar = req.body.aadhar;
    const apps = await ApplyInsurance.find({ aadhaar });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user insurance applications", error: err.message });
  }
};

// EMPLOYEE: Get applications submitted by them
exports.getEmployeeInsuranceApplications = async (req, res) => {
  try {
    const apps = await ApplyInsurance.find({ appliedBy: req.user.id })
      .populate( "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching insurance applications", error: err.message });
  }
};

// ADMIN: Get all
exports.getAllInsuranceApplications = async (req, res) => {
  try {
    const apps = await ApplyInsurance.find()
      
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all insurance applications", error: err.message });
  }
};

// ADMIN: Update status
exports.updateInsuranceApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const app = await ApplyInsurance.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Insurance status updated", app });
  } catch (err) {
    res.status(500).json({ message: "Error updating insurance status", error: err.message });
  }
};

// EMPLOYEE/USER: Withdraw application

exports.withdrawInsuranceApplication = async (req, res) => {
  try {
    const aadhaarNumber = req.body; // this is the forUser's id

    const app = await ApplyInsurance.findOneAndUpdate(
      { aadhaarNumber: aadhaarNumber },               // filter by forUser
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