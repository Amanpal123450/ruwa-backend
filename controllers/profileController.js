const User = require("../model/user");

// Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update logged-in user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body; // only include editable fields
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
      select: "-password"
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};
