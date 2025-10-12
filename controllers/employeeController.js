// controllers/employeeController.js
const User = require("../model/user");
// const mongoose=require("mongoose")
const AmbulanceBooking = require("../model/ambulanceBooking");
const ApplyInsuranceApplication = require("../model/applyInsurance");
const JanArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApply = require("../model/janArogyaApply");
const sevaApplication=require("../model/sevaApplication")

const Task = require("../model/taskSchema");
const Attendance = require("../model/attendance");
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
    const employeeId = req.user._id ;

    // Fetch all applications with populated 
    const ambulance = await AmbulanceBooking.find({ appliedBy: employeeId })
    const insurance = await ApplyInsuranceApplication.find({ appliedBy: employeeId })
    const janArogya = await JanArogyaApplication.find({ appliedBy: employeeId })
    const janArogyaApply = await JanArogyaApply.find({ appliedBy: employeeId })

    // Flatten into desired format
    const appliedUsers = [
      ...ambulance.map(a => ({
        name: a.fullName,
        email: a.email,
        phone: a.phone,
        status:a.status,
        hospitalPreference:a.hospitalPreference,
        appointmentDate:a.appointmentDate,
        preferredTime:a.preferredTime,
        submittedAt:a.submittedAt,
        service: "AmbulanceBooking"
      })),
      ...insurance.map(i => ({
        name: i.fullName,
        email: i.email,
        aadhaarNumber:i.aadhaarNumber,
        district:i.district,
        dob:i.dob,
        phone: i.phone || "Not Provided",
        status:i.status,
        service: "ApplyInsurance",
        insuranceType:i.insuranceType
      })),
      ...janArogya.map(j => ({
        name: j.name,
        email: j.email || "Not Provided",
        phone: j.phone || "Not Provided",
        state:j.state,
        district:j.district,
        status:j.status,
        service: "JanArogyaApplication"
      })),
      ...janArogyaApply.map(j => ({
        name: j.name,
        email: j.email || "Not Provided",                         
        phone: j.phone,
        businessType:j.businessType,
        investmentCapacity:j.investmentCapacity,
        proposedLocation:j.proposedLocation,
        franchiseCategory:j.franchiseCategory,
        category:j.category,
        status:j.status,
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
  console.log("Service requested:", service);
    let applications = [];

    switch (service) {
      case "ambulance":
        applications = await AmbulanceBooking.find({ appliedBy: employeeId })
          
        break;

      case "insurance":
        applications = await ApplyInsuranceApplication.find({ appliedBy: employeeId })
          
        break;

      case "janArogyaApplication":
        applications = await JanArogyaApplication.find({ appliedBy: employeeId })
          
        break;

      case "janArogyaApply":
        console.log("git itttt")
        applications = await JanArogyaApply.find({ appliedBy: employeeId })
          
        break;
     case "sevaApplication":
        applications = await sevaApplication.find({ appliedBy: employeeId })
          
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid service type" });
    }

    // format users for frontend
    const appliedUsers = applications.map(app => ({
      name: app.name || app.fullName, 
      email: app.email ,
      phone: app.mobile || app.phone,
      status: app.status,
      service,
      createdAt: app.createdAt,
      id:  app._id,
      applicationId:app.applicationId
    }));

    res.json({ success: true, service, appliedUsers });
  } catch (err) {
    console.error("Error in getEmployeeServiceUsers:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAppliedByMe=async(req,res)=>{
     try {
      const employeeId=req.user.id
      console.log(employeeId)

      const users=await User.find({appliedBy:employeeId});
      if(!users){
        return res.status(400).json({message:"No User Found"})
      }
      return res.status(200).json({success:true,users})
     } catch (error) {
      return res.status(400).json({message:error.message})
     }
}
// controllers/dashboardController.js


exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // ---------- PROFILE ----------
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ---------- WORKDAY STATUS ----------
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let record = await Attendance.findOne({
      user: userId,
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          new Date().toISOString().slice(0, 10)
        ]
      }
    });

    let workDayStatus;
    if (!record) {
      workDayStatus = {
        status: "absent",
        checkInTime: "-",
        hoursWorked: "0h",
        breaksTaken: 0,
        remainingHours: "8h",
      };
    } else {
      const checkInTime = record.checkIn
        ? record.checkIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "-";

      let hoursWorked = 0;
      if (record.checkIn) {
        const endTime = record.checkOut ? record.checkOut : new Date();
        hoursWorked = ((endTime - record.checkIn) / (1000 * 60 * 60)).toFixed(2);
      }

      let remainingHours = (8 - hoursWorked).toFixed(2);
      if (remainingHours < 0) remainingHours = 0;

      workDayStatus = {
        status: record.status,
        checkInTime,
        hoursWorked: `${hoursWorked}h`,
        breaksTaken: record.breaks ? record.breaks.length : 0,
        remainingHours: `${remainingHours}h`,
      };
    }

    // ---------- PERFORMANCE ----------
    const total = await Task.countDocuments({ employee: userId });
    const completed = await Task.countDocuments({ employee: userId, status: "COMPLETED" });
    const performance = total > 0 ? ((completed * 100) / total).toFixed(2) : "0.00";

    const performanceStats = {
      totalTasks: total,
      completedTasks: completed,
      performancePercentage: performance,
    };

    // ---------- TODAY'S TASKS ----------
    const tasks = await Task.find({
      employee: userId,
      assignedDate: { $gte: today, $lt: tomorrow },
    });

    // ---------- PROFILE FIELDS CONFIGURATION ----------
    const profileFields = [
      { icon: "📍", label: "Address", field: "address" },
      { icon: "📱", label: "Contact", field: "phone" },
      { icon: "🏢", label: "Area of Work", field: "department" },
      { icon: "👔", label: "Designation", field: "designation" },
      { icon: "🏛️", label: "Department", field: "department" },
      { icon: "💼", label: "Work Role", field: "workRole" },
      { icon: "🩸", label: "Blood Group", field: "bloodGroup" },
    ];

    // ---------- WORK DAY STATUS FIELDS ----------
    const workDayFields = [
      { icon: "✅", label: "Status", field: "status", color: "#10b981" },
      { icon: "🕐", label: "Check-in Time", field: "checkInTime", color: "#3b82f6" },
      { icon: "⏱️", label: "Hours Worked", field: "hoursWorked", color: "#8b5cf6" },
      { icon: "☕", label: "Breaks Taken", field: "breaksTaken", color: "#f59e0b", suffix: " breaks" },
      { icon: "⏳", label: "Remaining Hours", field: "remainingHours", color: "#ef4444" },
    ];

    // ---------- PERFORMANCE FIELDS ----------
    const performanceFields = [
      { label: "Performance Score", field: "performancePercentage", suffix: "%", color: "#10b981" },
      { label: "Total Tasks", field: "totalTasks", color: "#3b82f6" },
      { label: "Completed Tasks", field: "completedTasks", color: "#8b5cf6" },
      { label: "Pending Tasks", field: "pendingTasks", color: "#f59e0b" },
    ];

    // ---------- QUICK ACTION CARDS ----------
    const quickActions = [
      {
        title: 'Manage Users',
        description: 'View and manage registered users',
        icon: '👥',
        link: '/manage-users',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        title: 'Applications',
        description: 'Review and process applications',
        icon: '📋',
        link: '/manage-applications',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        title: 'Attendance',
        description: 'Punch your daily attendance',
        icon: '🕒',
        link: '/employee-att',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      },
      {
        title: 'Reports',
        description: 'View analytics and reports',
        icon: '📊',
        link: '/employee-reports',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      }
    ];

    // ---------- DAILY ANALYSIS ----------
    const dailyAnalysis = [
      { icon: "📝", label: "Applications Processed", value: 23, color: "#667eea" },
      { icon: "👤", label: "Users Helped", value: 45, color: "#f093fb" },
      { icon: "📞", label: "Calls Attended", value: 12, color: "#4facfe" },
      { icon: "✉️", label: "Emails Responded", value: 34, color: "#10b981" },
      { icon: "👥", label: "Meetings Attended", value: 3, color: "#f59e0b" },
    ];

    // ---------- GREETING CONFIGURATION ----------
    const greetingConfig = {
      morning: { text: 'Good Morning', icon: '👋', hourStart: 0, hourEnd: 12 },
      afternoon: { text: 'Good Afternoon', icon: '👋', hourStart: 12, hourEnd: 17 },
      evening: { text: 'Good Evening', icon: '👋', hourStart: 17, hourEnd: 24 }
    };

    // ---------- STATUS COLORS ----------
    const statusColors = {
      'present': '#10b981',
      'absent': '#ef4444',
      'Active': '#10b981',
      'Inactive': '#6b7280'
    };

    // ---------- SECTION TITLES ----------
    const sectionTitles = {
      profile: '📋 Employee Profile',
      workDay: '⏰ Work Day Status',
      performance: '📈 Performance Tracker',
      todoList: '✅ To-Do List',
      dailyAnalysis: '📊 Daily Analysis Report',
      quickActions: '🚀 Quick Actions'
    };

    // ---------- PRIORITY COLORS ----------
    const priorityColors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };

    // ---------- EMPTY STATES ----------
    const emptyStates = {
      tasks: {
        icon: '📭',
        message: 'No tasks assigned for today'
      }
    };

    // ---------- FINAL RESPONSE ----------
    res.json({
      success: true,
      profile: user,
      workDayStatus,
      performance: performanceStats,
      todaysTasks: tasks,
      
      // UI Configuration
      uiConfig: {
        profileFields,
        workDayFields,
        performanceFields,
        quickActions,
        dailyAnalysis,
        greetingConfig,
        statusColors,
        sectionTitles,
        priorityColors,
        emptyStates
      }
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

