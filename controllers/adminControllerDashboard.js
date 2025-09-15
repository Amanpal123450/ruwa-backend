const User = require("../model/user");
const ApplyInsurance = require("../model/applyInsurance");
const AmbulanceBooking = require("../model/ambulanceBooking");
const JanArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApply = require("../model/janArogyaApply");
const ContactMessage = require("../model/contactMessage");

exports.getAdminDashboardStats = async (req, res) => {
  try {
    
    const totalUsers = await User.countDocuments({ role: "USER" });
    const totalEmployees = await User.countDocuments({ role: "EMPLOYEE" });
    const totalInsuranceApplications = await ApplyInsurance.countDocuments();
    const totalAmbulanceBookings = await AmbulanceBooking.countDocuments();
   const totalJanArogyaApplications = await JanArogyaApplication.countDocuments({ status: "APPROVED" });
    const totalJanArogyaApply = await JanArogyaApply.countDocuments({ status: "approved" });
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const totalContactMessageToday = await ContactMessage.countDocuments({
      submittedAt: { $gte: startOfToday, $lte: endOfToday }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEmployees,
        totalInsuranceApplications,
        totalAmbulanceBookings,
        totalJanArogyaApplications,
        totalJanArogyaApply,
        totalContactMessageToday
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard stats",
      error: error.message,
    });
  }
};
