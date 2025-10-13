const JobApplication = require('../model/jobSchema');
const { uploadToCloudinary } = require("../utils/imageUploader");

// Helper function to validate Base64
const isValidBase64 = (str) => {
  if (!str || typeof str !== 'string') return false;
  
  // Check if it's a data URL (data:image/jpeg;base64,...)
  const base64Regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/;
  return base64Regex.test(str);
};

exports.submitApplication = async (req, res) => {
  try {
    const {
      // Personal Information
      jobId, fullName, email, phoneNumber, dateOfBirth, gender,
      
      // Address Details
      address, city, state, pincode,
      
      // Educational Information
      educationalQualification, institution, yearOfPassing,
      
      // Professional Information
      experienceYears, previousEmployer, currentSalary, expectedSalary,
      
      // Job Specific
      specialization, licenseNumber, registrationNumber,
      
      // Additional
      coverLetter, linkedinProfile, portfolio,
      
      // Files (Base64)
      resume, photo, idProof, educationalCertificate, 
      experienceCertificate, drivingLicense, medicalRegistration
    } = req.body;

    // Validate required fields
    if (!jobId || !fullName || !email || !phoneNumber || !dateOfBirth || !gender) {
      return res.status(400).json({ message: 'Personal information fields are required' });
    }

    if (!address || !city || !state || !pincode) {
      return res.status(400).json({ message: 'Address fields are required' });
    }

    if (!educationalQualification) {
      return res.status(400).json({ message: 'Educational qualification is required' });
    }

    if (!resume || !photo || !idProof) {
      return res.status(400).json({ message: 'Resume, Photo, and ID Proof are required' });
    }

    // Validate Base64 format for required files
    if (!isValidBase64(resume)) {
      return res.status(400).json({ message: 'Invalid resume format. Please upload a valid file.' });
    }
    if (!isValidBase64(photo)) {
      return res.status(400).json({ message: 'Invalid photo format. Please upload a valid file.' });
    }
    if (!isValidBase64(idProof)) {
      return res.status(400).json({ message: 'Invalid ID proof format. Please upload a valid file.' });
    }

    // Check if user already applied
    const existingApplication = await JobApplication.findOne({ jobId, email });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    console.log('Uploading required documents to Cloudinary...');
    
    // Upload required documents to Cloudinary
    const resumeUrl = await uploadToCloudinary(resume, 'jobApplications/resumes');
    console.log('Resume uploaded:', resumeUrl.secure_url);
    
    const photoUrl = await uploadToCloudinary(photo, 'jobApplications/photos');
    console.log('Photo uploaded:', photoUrl.secure_url);
    
    const idProofUrl = await uploadToCloudinary(idProof, 'jobApplications/idProofs');
    console.log('ID Proof uploaded:', idProofUrl.secure_url);

    const documents = {
      resume: resumeUrl.secure_url,
      photo: photoUrl.secure_url,
      idProof: idProofUrl.secure_url
    };

    // Upload optional documents
    if (educationalCertificate && isValidBase64(educationalCertificate)) {
      try {
        const eduUrl = await uploadToCloudinary(educationalCertificate, 'jobApplications/certificates');
        documents.educationalCertificate = eduUrl.secure_url;
        console.log('Educational certificate uploaded');
      } catch (error) {
        console.error('Error uploading educational certificate:', error.message);
        // Continue without this optional document
      }
    }

    if (experienceCertificate && isValidBase64(experienceCertificate)) {
      try {
        const expUrl = await uploadToCloudinary(experienceCertificate, 'jobApplications/certificates');
        documents.experienceCertificate = expUrl.secure_url;
        console.log('Experience certificate uploaded');
      } catch (error) {
        console.error('Error uploading experience certificate:', error.message);
        // Continue without this optional document
      }
    }

    if (drivingLicense && isValidBase64(drivingLicense)) {
      try {
        const licenseUrl = await uploadToCloudinary(drivingLicense, 'jobApplications/licenses');
        documents.drivingLicense = licenseUrl.secure_url;
        console.log('Driving license uploaded');
      } catch (error) {
        console.error('Error uploading driving license:', error.message);
        // Continue without this optional document
      }
    }

    if (medicalRegistration && isValidBase64(medicalRegistration)) {
      try {
        const medRegUrl = await uploadToCloudinary(medicalRegistration, 'jobApplications/registrations');
        documents.medicalRegistration = medRegUrl.secure_url;
        console.log('Medical registration uploaded');
      } catch (error) {
        console.error('Error uploading medical registration:', error.message);
        // Continue without this optional document
      }
    }

    console.log('Creating application in database...');
    
    // Create application
    const application = new JobApplication({
      jobId, 
      fullName, 
      email, 
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth), 
      gender,
      address, 
      city, 
      state, 
      pincode,
      educationalQualification, 
      institution, 
      yearOfPassing,
      experienceYears: experienceYears ? parseInt(experienceYears) : 0,
      previousEmployer, 
      currentSalary, 
      expectedSalary,
      specialization, 
      licenseNumber, 
      registrationNumber,
      coverLetter, 
      linkedinProfile, 
      portfolio,
      documents,
      status: 'pending'
    });

    await application.save();
    console.log('Application saved successfully:', application._id);

    return res.status(201).json({ 
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to submit application',
      error: error.message 
    });
  }
};

// ==========================================
// ADMIN ROUTES - View & Manage Applications
// ==========================================

// Get all applications with filters
exports.getAllApplications = async (req, res) => {
  try {
    const { 
      status, 
      jobId, 
      search,
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (jobId) filter.jobId = jobId;
    
    // Search by name, email, or phone
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const applications = await JobApplication.find(filter)
      .populate('jobId', 'postName advertisementNumber jobCategory department location salary')
      .populate('reviewedBy', 'name email')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .lean();

    const total = await JobApplication.countDocuments(filter);

    res.json({
      success: true,
      applications,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch applications',
      error: error.message 
    });
  }
};

// Get applications for a specific job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { jobId };
    if (status) filter.status = status;

    const applications = await JobApplication.find(filter)
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const total = await JobApplication.countDocuments(filter);

    // Get status breakdown
    const statusBreakdown = await JobApplication.aggregate([
      { $match: { jobId: require('mongoose').Types.ObjectId(jobId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      applications,
      statusBreakdown,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch applications',
      error: error.message 
    });
  }
};

// Get single application details
exports.getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate('jobId')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch application',
      error: error.message 
    });
  }
};

// Update application status (Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'under_review', 'shortlisted', 'rejected', 'selected'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const updateData = {
      status,
      reviewedAt: new Date()
    };

    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    // If you have admin user authentication, add:
    // updateData.reviewedBy = req.user._id;

    const application = await JobApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('jobId', 'postName advertisementNumber')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    });

  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update application',
      error: error.message 
    });
  }
};

// Get application statistics
exports.getApplicationStats = async (req, res) => {
  try {
    const { jobId } = req.query;

    const matchStage = jobId ? { jobId: require('mongoose').Types.ObjectId(jobId) } : {};

    // Status breakdown
    const statusStats = await JobApplication.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Total applications
    const totalApplications = await JobApplication.countDocuments(matchStage);

    // Recent applications
    const recentApplications = await JobApplication.find(matchStage)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('jobId', 'postName advertisementNumber')
      .select('fullName email phoneNumber status createdAt jobId');

    // Applications by job (if no specific job filter)
    let applicationsByJob = [];
    if (!jobId) {
      applicationsByJob = await JobApplication.aggregate([
        {
          $group: {
            _id: '$jobId',
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: '_id',
            foreignField: '_id',
            as: 'jobDetails'
          }
        },
        { $unwind: '$jobDetails' },
        {
          $project: {
            jobTitle: '$jobDetails.postName',
            advertisementNumber: '$jobDetails.advertisementNumber',
            count: 1
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
    }

    res.json({
      success: true,
      stats: {
        totalApplications,
        statusBreakdown: statusStats,
        recentApplications,
        applicationsByJob
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
};

// Delete application (Admin)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Application deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete application',
      error: error.message 
    });
  }
};