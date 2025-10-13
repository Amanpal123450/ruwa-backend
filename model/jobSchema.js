const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  // Job Reference
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  
  // Personal Information
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  
  // Address Details
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  
  // Educational Information
  educationalQualification: { type: String, required: true },
  institution: String,
  yearOfPassing: String,
  
  // Professional Information
  experienceYears: Number,
  previousEmployer: String,
  currentSalary: String,
  expectedSalary: String,
  
  // Job Specific
  specialization: String,
  licenseNumber: String,
  registrationNumber: String,
  
  // Additional
  coverLetter: String,
  linkedinProfile: String,
  portfolio: String,
  
  // File Paths (stored after upload)
  documents: {
    resume: { type: String, required: true },
    photo: { type: String, required: true },
    idProof: { type: String, required: true },
    educationalCertificate: String,
    experienceCertificate: String,
    drivingLicense: String,
    medicalRegistration: String,
  },
  
  // Application Status
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'under_review', 'shortlisted', 'rejected', 'selected']
  },
  
  // Admin Notes
  adminNotes: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  
}, { timestamps: true });

// Index for faster queries
jobApplicationSchema.index({ jobId: 1, status: 1 });
jobApplicationSchema.index({ email: 1 });
jobApplicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);