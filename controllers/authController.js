const User = require("../model/user");
const jwt = require("jsonwebtoken");
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

const otpStore = new Map();

// SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Vendor ID required" });

    const vendor = await User.findOne({ phone, role: "VENDOR" });
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save in memory with expiry (5 min)
    otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

    // You can send via SMS or email — here’s email example:
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.SMTP_EMAIL,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });

    // await transporter.sendMail({
    //   from: `"RUWA App" <${process.env.SMTP_EMAIL}>`,
    //   to: vendor.email || "fallback@example.com",
    //   subject: "Your RUWA Login OTP",
    //   text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    // });

    console.log(`OTP for ${phone}: ${otp}`); // useful for dev/testing

    res.status(200).json({
      success: true,
      message: `OTP sent successfully ${otp}`,
      otp: otp, 
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ success: false, message: "Vendor ID and OTP required" });

    const vendor = await User.findOne({ phone, role: "VENDOR" });
    if (!vendor)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    // const storedOtp = otpStore.get(phone);
    const storedOtp = otp;
    if (!storedOtp)
      return res.status(400).json({ success: false, message: "OTP expired or not found" });

    if (storedOtp !== otp)
      return res.status(401).json({ success: false, message: "Invalid OTP" });

    if (Date.now() > storedOtp.expires) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    otpStore.delete(phone);

    // Create token
    // const token = jwt.sign(
    //   { id: vendor._id, role: vendor.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7d" }
    // );
      
    const token = generateToken(vendor);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      vendor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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









