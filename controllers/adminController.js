const bcrypt = require("bcryptjs");
const User = require("../model/user");
const { sendEmail } = require("../utils/sendEmail");
require('dotenv').config();

// Get Profile

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
    if (employee.email) {
      await sendEmail(
        employee.email, // Receiver
        "Profile Updated Successfully ✔️", // Subject
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 300;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 20px;
              color: #2c3e50;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .message {
              font-size: 16px;
              margin-bottom: 30px;
              color: #555555;
            }
            .details-section {
              background-color: #f8f9fa;
              border-radius: 8px;
              padding: 25px;
              margin: 25px 0;
            }
            .details-title {
              font-size: 18px;
              font-weight: 600;
              color: #2c3e50;
              margin-bottom: 20px;
              border-bottom: 2px solid #667eea;
              padding-bottom: 8px;
            }
            .detail-item {
              display: flex;
              margin-bottom: 12px;
              align-items: center;
            }
            .detail-label {
              font-weight: 600;
              color: #495057;
              min-width: 120px;
              margin-right: 15px;
            }
            .detail-value {
              color: #2c3e50;
              flex: 1;
              padding: 8px 12px;
              background-color: #ffffff;
              border-radius: 4px;
              border: 1px solid #dee2e6;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 20px;
              margin: 25px 0;
              border-radius: 0 6px 6px 0;
            }
            .warning-text {
              color: #856404;
              font-weight: 500;
              margin: 0;
            }
            .footer {
              background-color: #2c3e50;
              color: #ecf0f1;
              padding: 25px 30px;
              text-align: center;
              font-size: 14px;
            }
            .footer p {
              margin: 0;
            }
            @media (max-width: 600px) {
              .email-container {
                margin: 10px;
                border-radius: 5px;
              }
              .header, .content, .footer {
                padding: 20px;
              }
              .detail-item {
                flex-direction: column;
                align-items: flex-start;
              }
              .detail-label {
                min-width: auto;
                margin-bottom: 5px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="success-icon">✅</div>
              <h1>Profile Updated Successfully</h1>
            </div>
            
            <div class="content">
              <div class="greeting">Hello ${employee.name || "Employee"}!</div>
              
              <div class="message">
                Your employee profile has been updated successfully. All changes have been saved and are now active in the system.
              </div>
              
              <div class="details-section">
                <div class="details-title">📋 Updated Profile Details</div>
                
                <div class="detail-item">
                  <div class="detail-label">Name:</div>
                  <div class="detail-value">${employee.name || 'Not provided'}</div>
                </div>
                
                <div class="detail-item">
                  <div class="detail-label">Employee ID:</div>
                  <div class="detail-value">${employee.employeeId || 'Not provided'}</div>
                </div>
                 <div class="detail-item">
                  <div class="detail-label">Employee password:</div>
                  <div class="detail-value">${ plainPassword|| 'Not provided'}</div>
                </div>
                
                <div class="detail-item">
                  <div class="detail-label">Phone:</div>
                  <div class="detail-value">${employee.phone || 'Not provided'}</div>
                </div>
                
                <div class="detail-item">
                  <div class="detail-label">Email:</div>
                  <div class="detail-value">${employee.email || 'Not provided'}</div>
                </div>
                
                <div class="detail-item">
                  <div class="detail-label">Department:</div>
                  <div class="detail-value">${employee.department || 'Not provided'}</div>
                </div>
                
                <div class="detail-item">
                  <div class="detail-label">Position:</div>
                  <div class="detail-value">${employee.position || 'Not provided'}</div>
                </div>
                
                <div class="detail-item">
                  <div class="detail-label">Address:</div>
                  <div class="detail-value">${employee.address || 'Not provided'}</div>
                </div>
              </div>
              
              <div class="warning">
                <p class="warning-text">
                  🚨 <strong>Security Notice:</strong> If you didn't request this profile update, please contact your HR administrator immediately for assistance.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>HR Management System</strong></p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
        `
      );
    }

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
    const subject = "Your Employee Account Details";
    const message = `
Hello ${name},

Your employee account has been created successfully. 
Here are your login credentials:

Employee ID: ${employeeId}
Password: ${password}
Mobile: ${phone}

Please keep this information secure.

- HR Team
`;

  await sendEmail(email, subject, message);

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
  }         
};
