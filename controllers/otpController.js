const JanArogyaApplication = require("../model/janArogyaApplication");

// ==============================
// SEND OTP CONTROLLER
// ==============================
exports.sendOtp = async (req, res) => {
  try {
    const { applicationNumber, mobileNumber } = req.body;

    if (!applicationNumber || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Application number and mobile number are required",
      });
    }

    if (mobileNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be 10 digits",
      });
    }

    const application = await JanArogyaApplication.findOne({
      "reciept.applicationId": applicationNumber,
      mobile: mobileNumber,
      status: "APPROVED",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "No approved card found with this application number and mobile",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    global.otpStore = global.otpStore || {};
    global.otpStore[mobileNumber] = {
      otp: otp,
      applicationId: applicationNumber,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins
    };

    // TODO: integrate SMS gateway
    console.log(`OTP for ${mobileNumber}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp:otp,
    //   otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again",
    });
  }
};

// ==============================
// VERIFY OTP CONTROLLER
// ==============================
exports.verifyOtp = async (req, res) => {
  try {
    const { applicationNumber, mobileNumber, otp } = req.body;

    if (!applicationNumber || !mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const storedOtpData = global.otpStore?.[mobileNumber];

    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found. Please request a new OTP",
      });
    }

    if (storedOtpData.expiresAt < Date.now()) {
      delete global.otpStore[mobileNumber];
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP",
      });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again",
      });
    }

    if (storedOtpData.applicationId !== applicationNumber) {
      return res.status(400).json({
        success: false,
        message: "Application number mismatch",
      });
    }

    const application = await JanArogyaApplication.findOne({
      "reciept.applicationId": applicationNumber,
      mobile: mobileNumber,
      status: "APPROVED",
    }).populate("appliedBy", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    delete global.otpStore[mobileNumber];

    const userData = {
      name: application.name,
      dob: application.DOB
        ? new Date(application.DOB).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      gender: application.gender || "N/A",
      address: `${application.district}, ${application.state}`,
      applicationNo: application.reciept.applicationId,
      cardNumber: application.card_no,
      validUpto: "31-Dec-2028",
      services: "Healthcare, Ambulance, Insurance",
      profilePicUrl:
        application.profilePicUser ||
        `https://placehold.co/100x100/E2E8F0/475569?text=${application.name.charAt(
          0
        )}`,
      mobile: application.mobile,
      email: application.email,
      aadhar: application.aadhar.replace(/\d(?=\d{4})/g, "X"),
      qrCode: application.Qr,
      submissionDate: application.reciept.submissionDate,
    };

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again",
    });
  }
};

// ==============================
// RESEND OTP CONTROLLER
// ==============================
exports.resendOtp = async (req, res) => {
  try {
    const { applicationNumber, mobileNumber } = req.body;

    if (!applicationNumber || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Application number and mobile number are required",
      });
    }

    const application = await JanArogyaApplication.findOne({
      "reciept.applicationId": applicationNumber,
      mobile: mobileNumber,
      status: "APPROVED",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No approved card found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    global.otpStore = global.otpStore || {};
    global.otpStore[mobileNumber] = {
      otp: otp,
      applicationId: applicationNumber,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    console.log(`Resend OTP for ${mobileNumber}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    //   otp: process.env.NODE_ENV === "development" ? otp : undefined,
      otp:otp
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
};
