// controllers/employeeController.js
const User = require("../model/user");
// const mongoose=require("mongoose")
const AmbulanceBooking = require("../model/ambulanceBooking");
const ApplyInsuranceApplication = require("../model/applyInsurance");
const JanArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApply = require("../model/janArogyaApply");
const moment = require("moment"); // for date filtering
const patient=require("../model/patient")
exports.getEmployeeProfile = async (req, res) => {
  try {
    // req.user.id comes from auth middleware after verifying JWT
    const employeeId = req.user.id;
    const ambulance = await AmbulanceBooking.find({ appliedBy: employeeId });
    const insurance = await ApplyInsuranceApplication.find({ appliedBy: employeeId });
    const janArogya = await JanArogyaApplication.find({ appliedBy: employeeId });
    const janArogyaApply = await JanArogyaApply.find({ appliedBy: employeeId });
    const totalServicesApplied =
      ambulance.length +
      insurance.length +
      janArogya.length +
      janArogyaApply.length;
        const pendingApplications =
      ambulance.filter(a => a.status === "APPROVED").length +
      insurance.filter(i => i.status === "APPROVED").length +
      janArogya.filter(j => j.status === "APPROVED").length +
      janArogyaApply.filter(j => j.status === "APPROVED").length;
const approvalRate=pendingApplications/totalServicesApplied*100
const totalApplications = await patient.countDocuments();
    const employee = await User.findById(employeeId).select("-password");
    if (!employee || employee.role !== "EMPLOYEE") {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee profile fetched successfully",
      profile: employee,
      totalApplications,
      totalServicesApplied,
      approvalRate
    });
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};








exports.getEmployeeAppliedUsers = async (req, res) => {
  try {
    const employeeId = req.user._id;

    // Fetch all applications with populated forUser
    const ambulance = await AmbulanceBooking.find({ appliedBy: employeeId }).populate("forUser", "name phone email");
    const insurance = await ApplyInsuranceApplication.find({ appliedBy: employeeId }).populate("forUser", "name phone email");
    const janArogya = await JanArogyaApplication.find({ appliedBy: employeeId }).populate("forUser", "name phone email");
    const janArogyaApply = await JanArogyaApply.find({ appliedBy: employeeId }).populate("forUser", "name phone email");

    // Flatten into desired format
    const appliedUsers = [
      ...ambulance.map(a => ({
        name: a.fullName,
        email: a.email,
        phone: a.phone,
        service: "AmbulanceBooking"
      })),
      ...insurance.map(i => ({
        name: i.fullName,
        email: i.email,
        phone: i.phone,
        service: "ApplyInsurance"
      })),
      ...janArogya.map(j => ({
        name: j.name,
        email: j.email,
        phone: j.phone,
        service: "JanArogyaApplication"
      })),
      ...janArogyaApply.map(j => ({
        name: j.name,
        email: j.email,
        phone: j.phone,
        service: "JanArogyaApply"
      }))
    ];

    res.json({ success: true, appliedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getEmployeeDashboard = async (req, res) => {
  try {
    const employeeId = req.user._id;

    // Today’s start and end time
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    // Fetch all applications by employee
    const ambulance = await AmbulanceBooking.find({ appliedBy: employeeId });
    const insurance = await ApplyInsuranceApplication.find({ appliedBy: employeeId });
    const janArogya = await JanArogyaApplication.find({ appliedBy: employeeId });
    const janArogyaApply = await JanArogyaApply.find({ appliedBy: employeeId });
   
    // 1️⃣ Total applications applied
    const totalApplications = await patient.countDocuments();
      

    // 2️⃣ Applications with status "PENDING"
    const pendingApplications =
      ambulance.filter(a => a.status === "PENDING").length +
      insurance.filter(i => i.status === "PENDING").length +
      janArogya.filter(j => j.status === "PENDING").length +
      janArogyaApply.filter(j => j.status === "PENDING").length;

    // 3️⃣ Users applied today (count only)
    const todayAppliedCount =
      ambulance.filter(a => a.createdAt >= startOfDay && a.createdAt <= endOfDay).length +
      insurance.filter(i => i.createdAt >= startOfDay && i.createdAt <= endOfDay).length +
      janArogya.filter(j => j.createdAt >= startOfDay && j.createdAt <= endOfDay).length +
      janArogyaApply.filter(j => j.createdAt >= startOfDay && j.createdAt <= endOfDay).length;

    res.json({
      success: true,
      dashboard: {
        totalApplications,
        pendingApplications,
        todayAppliedCount, // ✅ only count
      },
    });
  } catch (err) {
    console.error("Error in getEmployeeDashboard:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/employeeController.jsF

exports.getEmployeeServiceUsers = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { service } = req.query; // frontend sends ?service=insurance

    let applications = [];

    switch (service) {
      case "ambulance":
        applications = await AmbulanceBooking.find({ appliedBy: employeeId })
          .populate("forUser", "name phone email");
        break;

      case "insurance":
        applications = await ApplyInsuranceApplication.find({ appliedBy: employeeId })
          .populate("forUser", "name phone email");
        break;

      case "janArogyaApplication":
        applications = await JanArogyaApplication.find({ appliedBy: employeeId })
          .populate("forUser", "name phone email");
        break;

      case "janArogyaApply":
        applications = await JanArogyaApply.find({ appliedBy: employeeId })
          .populate("forUser", "name phone email");
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid service type" });
    }

    // format users for frontend
    const appliedUsers = applications.map(app => ({
      name: app.name || app.fullName || app.forUser?.name,
      email: app.email || app.forUser?.email,
      phone: app.phone || app.forUser?.phone,
      status: app.status,
      service,
      createdAt: app.createdAt,
    }));

    res.json({ success: true, service, appliedUsers });
  } catch (err) {
    console.error("Error in getEmployeeServiceUsers:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
