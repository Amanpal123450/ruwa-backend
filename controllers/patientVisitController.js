const patient = require("../model/patient");

// 📌 Create new patient (visit)
exports.createPatient = async (req, res) => {
  try {
    const { name, phone, email, age, aadhar, purpose, status,joinDate } = req.body;
    const employeeId=req.user.id
    // ✅ Validation
    if (!name || !phone || !email || !age || !aadhar || !purpose || !status || !joinDate) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
      console.log(employeeId)
    // ✅ Auto-generate profile pic if not provided
    const profilePic = req.body.profilePic || 
      `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 50) + 1}.jpg`;

    const newPatient = new patient({
      name,
      phone,
      email,
      age,
      aadhar,
      purpose,
      status,
      joinDate,
      applications:0,
      profilePic,
      appliedBy:employeeId
    });

    await newPatient.save();

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      user: newPatient
    });
  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Get all patients
exports.getPatients = async (req, res) => {
  const id = req.user.id;

  try {
    // today range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // fetch today patients only
    const patients = await patient.find({
      appliedBy: id,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });

    // counts for today
    const activePatients = await patient.countDocuments({
      appliedBy: id,
      status: "active",
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const pendingPatients = await patient.countDocuments({
      appliedBy: id,
      status: "pending",
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const inactivePatients = await patient.countDocuments({
      appliedBy: id,
      status: "inactive",
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    res.status(200).json({
      success: true,
      todayPatients: patients,   // 👈 only today patients list
      activeUsers: activePatients,
      pendingUsers: pendingPatients,
      inactiveUsers: inactivePatients,
      totalToday: patients.length   // 👈 optional: total today patients
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// 📌 Update patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    res.status(200).json({ success: true, user: patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 📌 Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const user = await patient.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 📌 Update patient status only (for dropdown action in frontend)
exports.updatePatientStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });

    const patient = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Patient status updated successfully",
      user: patient
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
