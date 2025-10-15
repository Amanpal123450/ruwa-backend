const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

// REGISTER
exports.register = async (req, res) => {

  const { name, phone, password, aadhar,email } = req.body;

  if (!name || !phone || !password  || !aadhar || !email) {           
    return res.status(400).json({ message: "All fields are required" });
  }


  let user = await User.findOne({ phone,aadhar });
  if (user) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  user = new User({ name, phone, password: hashed, role:"USER",aadhar,email });
  await user.save();

  const token = generateToken(user);
  res.json({ message: "Registered", token, role: user.role });
};
 exports.adminRegister = async (req, res) => {
  const { name, phone, password,email } = req.body;
  if (!name || !phone || !password ,!email ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let user = await User.findOne({ phone});
  if (user) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  user = new User({ name, phone,email, password: hashed, role:"ADMIN" ,userId:Date.now() + Math.floor(Math.random() * 1000)});
  await user.save();

  const token = generateToken(user);
  res.json({ message: "Registered", token, role: user.role });
 }
// LOGIN via password
exports.login = async (req, res) => {
  try {
    const { phone, employeeId, vendorId, password } = req.body;

    if (!password || (!phone && !employeeId && !vendorId)) {
      return res.status(400).json({ message: "Missing login credentials" });
    }

    // Find user by phone / employeeId / vendorId
    let user;
    if (phone) {
      user = await User.findOne({ phone });
    } else if (employeeId) {
      user = await User.findOne({ employeeId });
    } else if (vendorId) {
      user = await User.findOne({ vendorId });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Role-specific checks
    if (user.role === "EMPLOYEE" && !user.verified) {
      return res.status(403).json({ message: "Employee not approved yet" });
    }

    if (user.role === "VENDOR" && !user.verified) {
      return res.status(403).json({ message: "Vendor not verified yet" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate token with role
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `${user.role} logged in successfully`,
      token,
      role: user.role,
      status: user.status,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        vendorId: user.vendorId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// RESET password (with phone verification logic assumed)
exports.resetPassword = async (req, res) => {
  const { phone, newPassword } = req.body;
  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password reset successful" });
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // set in middleware
    console.log(userId)
    const user = await User.findById(userId).select("-password"); // exclude password
    console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};









