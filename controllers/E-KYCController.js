const EKYC = require('../model/E-KYC');
const janArogyaApply = require('../model/janArogyaApply');
const { uploadToCloudinary } = require('../utils/imageUploader');

/**
 * ================================
 * USER CONTROLLERS
 * ================================
 */

// USER: Submit E-KYC Form
exports.submitEKYC = async (req, res) => {
  try {
    const { applicationId } = req.body;
  
  
    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required'
      });
    }
 

    // Check if E-KYC already exists for this application
    const existingEKYC = await EKYC.findOne({ applicationId });
    if (existingEKYC) {
      return res.status(400).json({
        success: false,
        message: 'E-KYC form already submitted for this application'
      });
    }

    // Check for duplicate Aadhaar
    const duplicateAadhaar = await EKYC.findOne({ aadhaar: req.body.aadhaar });
    if (duplicateAadhaar) {
      return res.status(400).json({
        success: false,
        message: 'E-KYC already exists with this Aadhaar number'
      });
    }

   
    const ekycData = {
      applicationId,
      // Section 1: Personal Information
      name: req.body.name,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      spouseName: req.body.spouseName,
      bloodGroup: req.body.bloodGroup,
      education: req.body.education,
      portfolio: req.body.portfolio,

      // Section 2: Address Details
      address: req.body.address,
      state: req.body.state,
      district: req.body.district,
      block: req.body.block,
      gramPanchayat: req.body.gramPanchayat,
      village: req.body.village,
      ward: req.body.ward,

      // Section 3: Kendra Location Details
      kendraLocation: req.body.kendraLocation,
      boundaryEast: req.body.boundaryEast,
      boundaryWest: req.body.boundaryWest,
      boundaryNorth: req.body.boundaryNorth,
      boundarySouth: req.body.boundarySouth,
      length: req.body.length,
      width: req.body.width,
      height: req.body.height,

      // Section 4: Infrastructure & Environment
      radiationEffect: req.body.radiationEffect,
      cellularTower: req.body.cellularTower,
      electricityHours: req.body.electricityHours,
      powerBackup: req.body.powerBackup,
      nearestMetro: req.body.nearestMetro,
      nearestRailway: req.body.nearestRailway,
      nearestAirport: req.body.nearestAirport,
      dumpYard: req.body.dumpYard,
      sewerage: req.body.sewerage,
      waterResources: req.body.waterResources,
      aqi: req.body.aqi,
      transportRoad: req.body.transportRoad === 'true',
      transportRailway: req.body.transportRailway === 'true',
      transportAirways: req.body.transportAirways === 'true',
      transportWaterways: req.body.transportWaterways === 'true',
      roadCondition: req.body.roadCondition,
      roadType: req.body.roadType,
      weatherHot: req.body.weatherHot === 'true',
      weatherRainy: req.body.weatherRainy === 'true',
      weatherCold: req.body.weatherCold === 'true',
      weatherMild: req.body.weatherMild === 'true',

      // Section 5: Kendra Structure
      structureType: req.body.structureType,
      floors: req.body.floors,

      // Section 6: Documents & Financial
      annualIncome: req.body.annualIncome,
      aadhaar: req.body.aadhaar,
      pan: req.body.pan,
      successorName: req.body.successorName,

      // Section 7: Contact & Family Details
      mobile1: req.body.mobile1,
      mobile2: req.body.mobile2,
      emergencyContact: req.body.emergencyContact,
      email: req.body.email,
      dependents: req.body.dependents,

      // Status
      status: 'submitted',
      submittedAt: new Date(),
      submittedBy: req.user?._id
    };

    // Get all uploaded files
    const files = req.files || {};

    // Upload Kendra Map
    if (files.kendraMap) {
      const uploadedMap = await uploadToCloudinary(
        files.kendraMap,
        process.env.FOLDER_NAME || 'ekyc',
        1920,
        1920
      );
      ekycData.kendraMap = uploadedMap.secure_url;
    }

    // Upload Structure Photos
    const structurePhotos = [
      'frontProfile',
      'rightProfile',
      'leftProfile',
      'topProfile',
      'surfaceProfile',
      'interiors'
    ];

    for (const photoField of structurePhotos) {
      if (files[photoField]) {
        const uploadedPhoto = await uploadToCloudinary(
          files[photoField],
          process.env.FOLDER_NAME || 'ekyc',
          1920,
          1920
        );
        ekycData[photoField] = uploadedPhoto.secure_url;
      }
    }

    // Upload 360° Videos
    if (files.video360Interior) {
      const uploadedVideo = await uploadToCloudinary(
        files.video360Interior,
        process.env.FOLDER_NAME || 'ekyc',
        null,
        null,
        { resource_type: 'video' }
      );
      ekycData.video360Interior = uploadedVideo.secure_url;
    }

    if (files.video360Exterior) {
      const uploadedVideo = await uploadToCloudinary(
        files.video360Exterior,
        process.env.FOLDER_NAME || 'ekyc',
        null,
        null,
        { resource_type: 'video' }
      );
      ekycData.video360Exterior = uploadedVideo.secure_url;
    }

    // Upload Documents
    const documents = ['bankPassbook', 'domicile', 'nocProperty', 'propertyDeed'];
    for (const docField of documents) {
      if (files[docField]) {
        const uploadedDoc = await uploadToCloudinary(
          files[docField],
          process.env.FOLDER_NAME || 'ekyc',
          1920,
          1920
        );
        ekycData[docField] = uploadedDoc.secure_url;
      }
    }

    // Create E-KYC record
    const ekyc = new EKYC(ekycData);
    await ekyc.save();
     const application = await janArogyaApply.findOneAndUpdate(
  { applicationId }, // filter
  { $set: { EKYC: true } }, // update EKYC to true
  { new: true } // return the updated document
);

if (!application) {
  return res.status(400).json({
    success: false,
    message: 'No Application With This Aadhar'
  });
}

    res.status(201).json({
      success: true,
      message: 'E-KYC form submitted successfully',
      data: ekyc
    });

  } catch (error) {
    console.error('E-KYC Submission Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit E-KYC form',
      error: error.message
    });
  }
};

// USER: Get E-KYC by Application ID
exports.getEKYCByApplicationId = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const ekyc = await EKYC.findOne({ applicationId });

    if (!ekyc) {
      return res.status(404).json({
        success: false,
        message: 'E-KYC record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ekyc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch E-KYC record',
      error: error.message
    });
  }
};

// USER: Get My E-KYC Forms
exports.getMyEKYCForms = async (req, res) => {
  try {
    const userId = req.user._id;
    const ekycForms = await EKYC.find({ submittedBy: userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: ekycForms.length,
      data: ekycForms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch E-KYC forms',
      error: error.message
    });
  }
};

/**
 * ================================
 * ADMIN CONTROLLERS
 * ================================
 */

// ADMIN: Get All E-KYC Forms with Filters
exports.getAllEKYCForms = async (req, res) => {
  try {
    const { status, state, district, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (state) filter.state = state;
    if (district) filter.district = district;

    if (search) {
      filter.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile1: { $regex: search, $options: 'i' } },
        { aadhaar: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const ekycForms = await EKYC.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('submittedBy', 'name email')
      .populate('verifiedBy', 'name email');

    const total = await EKYC.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: ekycForms,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch E-KYC forms',
      error: error.message
    });
  }
};

// ADMIN: Update E-KYC Status
exports.updateEKYCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const validStatuses = ['pending', 'submitted', 'verified', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const ekyc = await EKYC.findById(id);
    if (!ekyc) {
      return res.status(404).json({
        success: false,
        message: 'E-KYC record not found'
      });
    }

    ekyc.status = status;
    ekyc.remarks = remarks;
    if (status === 'verified') {
      ekyc.verifiedAt = new Date();
      ekyc.verifiedBy = req.user._id;
    }

    await ekyc.save();
    res.status(200).json({
      success: true,
      message: `E-KYC ${status} successfully`,
      data: ekyc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update E-KYC status',
      error: error.message
    });
  }
};

// ADMIN: Delete E-KYC
exports.deleteEKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const ekyc = await EKYC.findByIdAndDelete(id);
    if (!ekyc) {
      return res.status(404).json({
        success: false,
        message: 'E-KYC record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'E-KYC record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete E-KYC record',
      error: error.message
    });
  }
};
