const Employee = require("../model/user"); // Your Employee mongoose model
const cloudinary = require("../utils/imageUploader"); // Cloudinary setup
const JanArogyaApplication=require("../model/janArogyaApplication");
const { default: mongoose } = require("mongoose");

// Get employee profile
exports.getProfile = async (req, res) => {
  try {
    const employeeId = req.user.id; 
    const profile = await Employee.findById(employeeId).select("-password");

    if (!profile) return res.status(404).json({ message: "Employee not found" });

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update employee profile
exports.updateProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const updates = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ profile: updatedEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { image } = req.files;

    const result = await cloudinary.uploadToCloudinary(
      image,               // <-- pass the file object
      "employee_profiles", // folder
      500,                 // height
      100                  // quality
    );

    const employee = await Employee.findByIdAndUpdate(
      userId,
      { profile_pic: result.secure_url },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ url: result.secure_url, profile: employee });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};



exports.uploadDOB = async (req, res) => {
  try {
    const userId = req.user.id;
    const { DOB,email } = req.body; // frontend sends { DOB: "YYYY-MM-DD" }

    if (!DOB) {
      return res.status(400).json({ message: "DOB is required" });
    }

   // Update DOB in Employee
const employee = await Employee.findByIdAndUpdate(
  userId,
  { DOB },
  { new: true, runValidators: true }
).select("-password");

if (!employee) {
  return res.status(404).json({ message: "Employee not found" });
}

// Update DOB in JanArogyaApplication (where appliedBy = userId)
const application = await JanArogyaApplication.findOneAndUpdate(
  { $or: [
      { appliedBy: new mongoose.Types.ObjectId(userId) },
      { forUser: new mongoose.Types.ObjectId(userId) }
    ]
  },
  { DOB },
  { new: true, runValidators: true }
);

console.log("fddfdf", application);

console.log("fddfdf",application);

res.status(200).json({
  message: "DOB updated successfully",
  profile: employee,
  application,
});

  } catch (err) {
    console.error("DOB update error:", err);
    res.status(500).json({ message: "DOB update failed", error: err.message });
  }
};

