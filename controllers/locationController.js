const User = require("../model/user");

// ✅ Employee → Update own location
// exports.updateLocation = async (req, res) => {
//   try {
//     const { lat, lng } = req.body;

//     if (!lat || !lng) {
//       return res.status(400).json({ message: "Latitude and Longitude required" });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         currentLocation: { lat, lng },
//         locationUpdatedAt: new Date(),
//         isOnline: true,
//       },
//       { new: true }
//     );

//     res.json({ message: "Location updated", user });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    // ✅ 0 ko allow karo
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "Latitude and Longitude required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          currentLocation: { lat, lng },
          locationUpdatedAt: new Date(),
          isOnline: true,
        }
      },
      { new: true }
    );
    await user.save();

    res.json({ message: "Location updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Admin → Get all employees with location or last seen
// controllers/employeeController.js
exports.getAllLatestEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "EMPLOYEE" }).select(
      "name employeeId currentLocation locationUpdatedAt isOnline lastSeen"
    );

    // Map employees to only show currentLocation if online, else show lastSeen
    const result = employees.map(emp => ({
      name: emp.name,
      employeeId: emp.employeeId,
      isOnline: emp.isOnline,
      currentLocation: emp.isOnline ? emp.currentLocation : null,
      lastSeen: emp.isOnline ? null : emp.lastSeen,
      locationUpdatedAt: emp.isOnline ? emp.locationUpdatedAt : null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

