const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  // Job Reference
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  
  // Personal Information
  fullName: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  
  // Address Details
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  
  // Educational Information
  educationalQualification: { type: String },
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
    resume: { type: String },
    photo: { type: String },
    idProof: { type: String },
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