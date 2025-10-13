const bcrypt = require("bcryptjs");
const User = require("../model/user");
const { sendEmail } = require("../utils/sendEmail");
require('dotenv').config();
const attendance=require("../model/attendance")
// Get Profile
const AmbulanceBooking = require("../model/ambulanceBooking");
const ApplyInsuranceApplication = require("../model/applyInsurance");
const JanArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApply = require("../model/janArogyaApply");
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "EMPLOYEE" });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    // Find attendance records for this employee
    const attendanceHistory = await attendance.find({ employeeId: id }).sort({ date: -1 });

    if (!attendanceHistory || attendanceHistory.length === 0) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json({
      success: true,
      history: attendanceHistory,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({ _id: id, role: "EMPLOYEE" });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Employee by Admin
exports.updateEmployee = async (req, res) => {
  try {
    const { name, phone, password, employeeId, email, department, position, address } = req.body;
    const { id } = req.params; // employee MongoDB _id

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
 let plainPassword = null;
    // Update fields
    if (name) employee.name = name;
    if (phone) employee.phone = phone;
    if (employeeId) employee.employeeId = employeeId;
    if (email) employee.email = email;
    if (department) employee.department = department;
    if (position) employee.position = position;
    if (address) employee.address = address;

    // Password update (agar diya gaya ho)
    if (password) {
        plainPassword = password; 
      const hashedPassword = await bcrypt.hash(password, 10);
      employee.password = hashedPassword;
    }

    await employee.save();

    // ✅ Styled Email Send
    // if (employee.email) {
    //   await sendEmail(
    //     employee.email, // Receiver
    //     "Profile Updated Successfully ✔️", // Subject
    //     `
    //     <!DOCTYPE html>
    //     <html>
    //     <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <style>
    //         body {
    //           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    //           line-height: 1.6;
    //           color: #333333;
    //           background-color: #f4f4f4;
    //           margin: 0;
    //           padding: 20px;
    //         }
    //         .email-container {
    //           max-width: 600px;
    //           margin: 0 auto;
    //           background-color: #ffffff;
    //           border-radius: 10px;
    //           box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    //           overflow: hidden;
    //         }
    //         .header {
    //           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    //           color: white;
    //           padding: 30px;
    //           text-align: center;
    //         }
    //         .header h1 {
    //           margin: 0;
    //           font-size: 28px;
    //           font-weight: 300;
    //         }
    //         .success-icon {
    //           font-size: 48px;
    //           margin-bottom: 10px;
    //         }
    //         .content {
    //           padding: 40px 30px;
    //         }
    //         .greeting {
    //           font-size: 20px;
    //           color: #2c3e50;
    //           margin-bottom: 20px;
    //           font-weight: 600;
    //         }
    //         .message {
    //           font-size: 16px;
    //           margin-bottom: 30px;
    //           color: #555555;
    //         }
    //         .details-section {
    //           background-color: #f8f9fa;
    //           border-radius: 8px;
    //           padding: 25px;
    //           margin: 25px 0;
    //         }
    //         .details-title {
    //           font-size: 18px;
    //           font-weight: 600;
    //           color: #2c3e50;
    //           margin-bottom: 20px;
    //           border-bottom: 2px solid #667eea;
    //           padding-bottom: 8px;
    //         }
    //         .detail-item {
    //           display: flex;
    //           margin-bottom: 12px;
    //           align-items: center;
    //         }
    //         .detail-label {
    //           font-weight: 600;
    //           color: #495057;
    //           min-width: 120px;
    //           margin-right: 15px;
    //         }
    //         .detail-value {
    //           color: #2c3e50;
    //           flex: 1;
    //           padding: 8px 12px;
    //           background-color: #ffffff;
    //           border-radius: 4px;
    //           border: 1px solid #dee2e6;
    //         }
    //         .warning {
    //           background-color: #fff3cd;
    //           border-left: 4px solid #ffc107;
    //           padding: 20px;
    //           margin: 25px 0;
    //           border-radius: 0 6px 6px 0;
    //         }
    //         .warning-text {
    //           color: #856404;
    //           font-weight: 500;
    //           margin: 0;
    //         }
    //         .footer {
    //           background-color: #2c3e50;
    //           color: #ecf0f1;
    //           padding: 25px 30px;
    //           text-align: center;
    //           font-size: 14px;
    //         }
    //         .footer p {
    //           margin: 0;
    //         }
    //         @media (max-width: 600px) {
    //           .email-container {
    //             margin: 10px;
    //             border-radius: 5px;
    //           }
    //           .header, .content, .footer {
    //             padding: 20px;
    //           }
    //           .detail-item {
    //             flex-direction: column;
    //             align-items: flex-start;
    //           }
    //           .detail-label {
    //             min-width: auto;
    //             margin-bottom: 5px;
    //           }
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="email-container">
    //         <div class="header">
    //           <div class="success-icon">✅</div>
    //           <h1>Profile Updated Successfully</h1>
    //         </div>
            
    //         <div class="content">
    //           <div class="greeting">Hello ${employee.name || "Employee"}!</div>
              
    //           <div class="message">
    //             Your employee profile has been updated successfully. All changes have been saved and are now active in the system.
    //           </div>
              
    //           <div class="details-section">
    //             <div class="details-title">📋 Updated Profile Details</div>
                
    //             <div class="detail-item">
    //               <div class="detail-label">Name:</div>
    //               <div class="detail-value">${employee.name || 'Not provided'}</div>
    //             </div>
                
    //             <div class="detail-item">
    //               <div class="detail-label">Employee ID:</div>
    //               <div class="detail-value">${employee.employeeId || 'Not provided'}</div>
    //             </div>
    //              <div class="detail-item">
    //               <div class="detail-label">Employee password:</div>
    //               <div class="detail-value">${ plainPassword|| 'Not provided'}</div>
    //             </div>
                
    //             <div class="detail-item">
    //               <div class="detail-label">Phone:</div>
    //               <div class="detail-value">${employee.phone || 'Not provided'}</div>
    //             </div>
                
    //             <div class="detail-item">
    //               <div class="detail-label">Email:</div>
    //               <div class="detail-value">${employee.email || 'Not provided'}</div>
    //             </div>
                
    //             <div class="detail-item">
    //               <div class="detail-label">Department:</div>
    //               <div class="detail-value">${employee.department || 'Not provided'}</div>
    //             </div>
                
    //             <div class="detail-item">
    //               <div class="detail-label">Position:</div>
    //               <div class="detail-value">${employee.position || 'Not provided'}</div>
    //             </div>
                
    //             <div class="detail-item">
    //               <div class="detail-label">Address:</div>
    //               <div class="detail-value">${employee.address || 'Not provided'}</div>
    //             </div>
    //           </div>
              
    //           <div class="warning">
    //             <p class="warning-text">
    //               🚨 <strong>Security Notice:</strong> If you didn't request this profile update, please contact your HR administrator immediately for assistance.
    //             </p>
    //           </div>
    //         </div>
            
    //         <div class="footer">
    //           <p><strong>HR Management System</strong></p>
    //           <p>This is an automated message. Please do not reply to this email.</p>
    //         </div>
    //       </div>
    //     </body>
    //     </html>
    //     `
    //   );
    // }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully and email sent",
      employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const alluser = await User.find({ role: "USER" });

    if (!alluser || alluser.length === 0) {
      return res.status(404).json({ message: "No User found" });
    }

    res.status(200).json({
      success: true,
      count: alluser.length,
      alluser,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, email, phone, address, language, time_zone, nationality, merchant_id } = req.body;

    const updateFields = { full_name, email, phone, address, language, time_zone, nationality, merchant_id };

    if (req.file) {
      updateFields.profile_pic = `/uploads/${req.file.filename}`;
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
exports.createEmployee = async (req, res) => {
  try {
    const { name, phone, password, employeeId, email,  department, position, address } = req.body;

    if (!name || !phone || !password || !employeeId || !email  || !department || !position || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if employeeId already exists
    const existingEmployeeId = await User.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee with role EMPLOYEE
    const newEmployee = new User({
      name,
      phone,
      password: hashedPassword,
      role: "EMPLOYEE",
      employeeId,
      email,
      verified: true,
      joinDate:Date.now(),
      department,
      address,
      position,
    });

   
       
    // ✅ Send email with Employee ID and Password
//     const subject = "Your Employee Account Details";
//     const message = `
// Hello ${name},

// Your employee account has been created successfully. 
// Here are your login credentials:

// Employee ID: ${employeeId}
// Password: ${password}
// Mobile: ${phone}

// Please keep this information secure.

// - HR Team
// `;

//   try {
//       await sendEmail(email, subject, message);
//     } catch (err) {
//       console.error("❌ Email failed but employee will still be created:", err.message);
//     }

 await newEmployee.save();
    res.status(201).json({
      message: "Employee created successfully and credentials sent via email.",
      employee: newEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;     
    const deleted = await User.findByIdAndDelete(employeeId);

    if (!deleted) {
      return res.status(404).json({ message: "Employee Not Found" });
    } 
    return res.status(200).json({ message: "Employee Deleted Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
};
}
exports.getAdminEmployeeAppliedUsers = async (req, res) => {
  try {
    // Get employee ID from request parameters instead of req.user._id
    const { employeeId } = req.params; // For route like /admin/employee/:employeeId/applied-users
    // OR use const employeeId = req.query.employeeId; for query parameter
    
    // Validate employee ID
    if (!employeeId) {
      return res.status(400).json({ 
        success: false, 
        message: "Employee ID is required" 
      });
    }

    // Fetch all applications with populated data for the specific employee
    const ambulance = await AmbulanceBooking.find({ appliedBy: employeeId });
    const insurance = await ApplyInsuranceApplication.find({ appliedBy: employeeId });
    const janArogya = await JanArogyaApplication.find({ appliedBy: employeeId });
    const janArogyaApply = await JanArogyaApply.find({ appliedBy: employeeId });

    // Flatten into desired format
    const appliedUsers = [
      ...ambulance.map(a => ({
        name: a.fullName,
        email: a.email,
        phone: a.phone,
        status: a.status,
        hospitalPreference: a.hospitalPreference,
        appointmentDate: a.appointmentDate,
        preferredTime: a.preferredTime,
        submittedAt: a.submittedAt,
        service: "AmbulanceBooking"
      })),
      ...insurance.map(i => ({
        name: i.fullName,
        email: i.email,
        aadhaarNumber: i.aadhaarNumber,
        district: i.district,
        dob: i.dob,
        phone: i.phone || "Not Provided",
        status: i.status,
        service: "ApplyInsurance",
        insuranceType: i.insuranceType
      })),
      ...janArogya.map(j => ({
        name: j.name,
        email: j.email || "Not Provided",
        phone: j.phone || "Not Provided",
        state: j.state,
        district: j.district,
        status: j.status,
        service: "JanArogyaApplication"
      })),
      ...janArogyaApply.map(j => ({
        name: j.name,
        email: j.email || "Not Provided",
        phone: j.phone,
        businessType: j.businessType,
        investmentCapacity: j.investmentCapacity,
        proposedLocation: j.proposedLocation,
        franchiseCategory: j.franchiseCategory,
        category: j.category,
        status: j.status,
        service: "JanArogyaApply"
      }))
    ];

    res.json({ success: true, appliedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAdminUserServices = async (req, res) => {
  try {
    // Get employee ID from request parameters instead of req.user._id
    const { phone } = req.params; // For route like /admin/employee/:employeeId/applied-users
    // OR use const employeeId = req.query.employeeId; for query parameter
    
    // Validate employee ID
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone  is required" 
      });
    }

    // Fetch all applications with populated data for the specific employee
    const ambulance = await AmbulanceBooking.find({ phone });
    const insurance = await ApplyInsuranceApplication.find({ phone });
    const janArogya = await JanArogyaApplication.find({ mobile: phone });
    const janArogyaApply = await JanArogyaApply.find({  phone });

    // Flatten into desired format
    const appliedUsers = [
      ...ambulance.map(a => ({
        name: a.fullName,
        email: a.email,
        phone: a.phone,
        status: a.status,
        hospitalPreference: a.hospitalPreference,
        appointmentDate: a.appointmentDate,
        preferredTime: a.preferredTime,
        submittedAt: a.submittedAt,
        service: "AmbulanceBooking"
      })),
      ...insurance.map(i => ({
        name: i.fullName,
        email: i.email,
        aadhaarNumber: i.aadhaarNumber,
        district: i.district,
        dob: i.dob,
        phone: i.phone || "Not Provided",
        status: i.status,
        service: "ApplyInsurance",
        insuranceType: i.insuranceType
      })),
      ...janArogya.map(j => ({
        name: j.name,
        email: j.email || "Not Provided",
        phone: j.phone || "Not Provided",
        state: j.state,
        district: j.district,
        status: j.status,
        service: "JanArogyaApplication"
      })),
      ...janArogyaApply.map(j => ({
        name: j.name,
        email: j.email || "Not Provided",
        phone: j.phone,
        businessType: j.businessType,
        investmentCapacity: j.investmentCapacity,
        proposedLocation: j.proposedLocation,
        franchiseCategory: j.franchiseCategory,
        category: j.category,
        status: j.status,
        service: "JanArogyaApply"
      }))
    ];

    res.json({ success: true, appliedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const { name, phone, password, aadhar, email, address,areaName, gstNumber,vendorId } = req.body;

    if (!name || !phone || !password || !aadhar || !address || !areaName|| !vendorId || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicates
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: "Phone already exists" });

    const existingAadhar = await User.findOne({ aadhar });
    if (existingAadhar) return res.status(400).json({ message: "Aadhar already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique vendorId (like EMP123@ or VEND123@)
    // let vendorId;
    // let isUnique = false;
    // while (!isUnique) {
    //   vendorId = `VEND@${Math.floor(1000 + Math.random() * 9000)}`;
    //   const existing = await User.findOne({ vendorId });
    //   if (!existing) isUnique = true;
    // }

    // Generate numeric userId
    const lastVendor = await User.findOne({ role: "VENDOR" }).sort({ userId: -1 });
    const newUserId = lastVendor ? lastVendor.userId + 1 : 2001;

    // Create vendor
    const newVendor = new User({
      name,
      phone,
      password: hashedPassword,
      aadhar,
      email,
      address,
      areaName,
      gstNumber,
      role: "VENDOR",
      vendorId,
      userId: newUserId,
      verified: true,
      joinDate: new Date().toISOString(),
    });

    await newVendor.save();

    // ✅ Optional: send login details to vendor
    // const subject = "Your Vendor Account Created";
    // const message = `
    // Hello ${name},

    // Your vendor account has been successfully created!
    // Vendor ID: ${vendorId}
    // Phone: ${phone}
    // Password: ${password}
    // Shop Name: ${shopName}

    // Regards,
    // RUWA Team
    // `;
    // await sendEmail(email, subject, message);

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor: newVendor,
    });
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
