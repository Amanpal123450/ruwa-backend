// const janArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApplication = require("../model/janArogyaApplication");
const user = require("../model/user");
const { uploadToCloudinary } = require("../utils/imageUploader");
const { sendEmail } = require("../utils/sendEmail");
 // same utility you use in createEmployee
const QRCode = require("qrcode");
const buildApplication = async (req, res) => {
  try {
    const { name, aadhar, mobile, state, district, DOB, gender, email } =
      req.body;
    const { income_certificate, caste_certificate, ration_id, profilePicUser } =
      req.files || {};

    const existing = await JanArogyaApplication.findOne({ aadhar });
    if (existing) return res.status(400).json({ message: "Already applied." });

    const app = new JanArogyaApplication({
      name,
      aadhar,
      mobile,
      state,
      district,
      DOB,
      gender,
      email,
      appliedBy: req.user.id,
    });

    if (income_certificate) {
      const image = await uploadToCloudinary(
        income_certificate,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      app.income_certificate = image.secure_url;
    }

    if (profilePicUser) {
      const image = await uploadToCloudinary(
        profilePicUser,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      app.profilePicUser = image.secure_url;
    }

    if (caste_certificate) {
      const image = await uploadToCloudinary(
        caste_certificate,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      app.caste_certificate = image.secure_url;
    }
    if (ration_id) {
      const image = await uploadToCloudinary(
        ration_id,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      app.ration_id = image.secure_url;
    }

    const qrData = {
      id: app._id,
      name: app.name,
      gender: app.gender,
      DOB: app.DOB,
      mobile: app.mobile,
      state: app.state,
      district: app.district,
      aadhar: app.aadhar,
    };

    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));
    if (qrCodeUrl) {
      app.Qr = qrCodeUrl;
    }
    await app.save();
    res.status(201).json({ message: "Application submitted", app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying", error: err.message });
  }
};

// USER applies for self
exports.userApplyJanarogya = (req, res) => buildApplication(req, res);

// EMPLOYEE applies for others
exports.applyJanarogya = async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ FILES:", req.files);

  return buildApplication(req, res);
};

exports.checkJanarogya = async (req, res) => {
  try {
    const { userId } = req.user; // coming from auth middleware

    // If application schema stores user reference as `userId`
    const application = await JanArogyaApplication.findOne({ userId }).populate(
      "status"
    );
    // console.log("ds",application)
    if (application && application.status == "PENDING") {
      return res.status(200).json({ msg: "USER ALREADY EXISTS" });
    }
    if (application && application.status == "APPROVED") {
      return res.status(200).json({
        msg: "APPROVED",
        application,
      });
    }

    return res.status(404).json({ msg: "USER NOT FOUND" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

// USER: Get own applications
exports.getUserApplication = async (req, res) => {
  const id = req.user.id;
  try {
    const apps = await JanArogyaApplication.find({ id });
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user application", error: err.message });
  }
};

// EMPLOYEE: Get applications submitted by them
exports.getJanarogyaApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApplication.find({
      appliedBy: req.user.id,
    }).populate("forUser", "name email");
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err.message });
  }
};

// ADMIN: Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApplication.find();
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all applications", error: err.message });
  }
};

// ADMIN: Update

exports.updateApplicationStatus = async (req, res) => {
  try {
    console.log("New status:", req.body.status);
    
    const app = await JanArogyaApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    if (req.body.status.toLowerCase() === "approved") {
      const subject = "🎉 Your Jan Arogya Card Application is Approved";
      
      const message = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jan Arogya Card Approval</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        
        <!-- Email Container -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; min-height: 100vh;">
          
          <!-- Main Card -->
          <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); position: relative;">
            
            <!-- Header Section with Gradient -->
            <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
              <!-- Decorative circles -->
              <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
              
              <!-- Success Icon -->
              <div style="display: inline-block; width: 80px; height: 80px; background: #ffffff; border-radius: 50%; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);">
                <span style="font-size: 40px; color: #4CAF50;">✓</span>
              </div>
              
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                Congratulations!
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 10px 0 0 0; font-weight: 300;">
                Your application has been approved
              </p>
            </div>
            
            <!-- Content Section -->
            <div style="padding: 40px 30px;">
              
              <!-- Welcome Message -->
              <div style="text-align: center; margin-bottom: 35px;">
                <h2 style="color: #2c3e50; font-size: 24px; font-weight: 600; margin: 0 0 15px 0;">
                  Hello, ${app.name}!
                </h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
                  We are thrilled to inform you that your <strong style="color: #4CAF50;">Jan Arogya Card</strong> application has been successfully approved. Your health card will be processed and delivered soon.
                </p>
              </div>
              
              <!-- Status Card -->
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f5e8 100%); border-radius: 15px; padding: 25px; margin-bottom: 30px; border-left: 5px solid #4CAF50;">
                <h3 style="color: #2c3e50; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">
                  📋 Application Details
                </h3>
                
                <!-- Details Table -->
                <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                  <tr>
                    <td style="padding: 15px 20px; background: #ffffff; border-radius: 8px 0 0 8px; border: 1px solid #e0e6ed; border-right: none; font-weight: 600; color: #2c3e50; width: 40%;">
                      🆔 Application ID
                    </td>
                    <td style="padding: 15px 20px; background: #ffffff; border-radius: 0 8px 8px 0; border: 1px solid #e0e6ed; color: #555; font-family: monospace; font-size: 14px;">
                      ${app._id}
                    </td>
                  </tr>
                  <tr><td style="height: 8px;" colspan="2"></td></tr>
                  <tr>
                    <td style="padding: 15px 20px; background: #ffffff; border-radius: 8px 0 0 8px; border: 1px solid #e0e6ed; border-right: none; font-weight: 600; color: #2c3e50;">
                      📊 Status
                    </td>
                    <td style="padding: 15px 20px; background: #ffffff; border-radius: 0 8px 8px 0; border: 1px solid #e0e6ed;">
                      <span style="background: #4CAF50; color: #ffffff; padding: 6px 15px; border-radius: 20px; font-weight: 600; font-size: 14px; display: inline-block;">
                        ✅ ${app.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Next Steps -->
              <div style="background: #fff8e1; border-radius: 15px; padding: 25px; margin-bottom: 30px; border-left: 5px solid #ffc107;">
                <h3 style="color: #2c3e50; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                  🎯 What's Next?
                </h3>
                <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Your Jan Arogya Card will be processed within 5-7 business days</li>
                  <li>You will receive a notification once your card is ready for collection</li>
                  <li>Keep your application ID safe for future reference</li>
                </ul>
              </div>
              
              <!-- Thank You Message -->
              <div style="text-align: center; margin-bottom: 30px;">
                <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
                  Thank you for choosing Jan Arogya Kendra for your healthcare needs.<br>
                  <strong style="color: #4CAF50;">We wish you and your family good health always! 🏥💚</strong>
                </p>
              </div>
              
              <!-- Contact Info -->
              <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; text-align: center;">
                <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                  Need help? Contact us at <a href="mailto:support@janarogya.gov.in" style="color: #4CAF50; text-decoration: none;">support@janarogya.gov.in</a>
                </p>
                <p style="color: #6c757d; font-size: 14px; margin: 0;">
                  📞 Helpline: 1800-XXX-XXXX (Toll Free)
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #2c3e50; padding: 25px 30px; text-align: center;">
              <p style="color: #ffffff; font-size: 16px; margin: 0 0 5px 0; font-weight: 600;">
                With regards,
              </p>
              <p style="color: #bdc3c7; font-size: 14px; margin: 0;">
                <strong>Jan Arogya Kendra Team</strong><br>
                Ministry of Health & Family Welfare, Government of India
              </p>
            </div>
            
          </div>
          
          <!-- Footer Disclaimer -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: rgba(255, 255, 255, 0.8); font-size: 12px; margin: 0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
          
        </div>
      </body>
      </html>
      `;
      
      if (app.email) {
        await sendEmail(app.email, subject, message);
      }
    }
    
    res.json({ message: "Status updated", app });
  } catch (err) {
    console.error("Error updating status:", err);
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
};


// EMPLOYEE/USER: Withdraw application

exports.withdrawApplication = async (req, res) => {
  try {
    const phone = req.body; // this is the forUser's id

    const app = await JanArogyaApplication.findOneAndUpdate(
      { mobile: phone }, // filter by forUser
      { status: "WITHDRAWN" }, // update
      { new: true } // return updated doc
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated successfully", app });
  } catch (err) {
    res.status(500).json({
      message: "Error updating status",
      error: err.message,
    });
  }
};
