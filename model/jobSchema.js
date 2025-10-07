const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Information
  jobTitle: { type: String, required: true },
  advertisementNumber: { type: String, required: true },
  postingDate: { type: Date, default: Date.now },
  totalVacancies: { type: Number, required: true },
  jobCategory: { type: String, required: true },

  // Position Details
  postName: { type: String, required: true },
  payScale: { type: String, required: true },
  numberOfPosts: { type: Number, required: true },

  // Eligibility
  minAge: Number,
  maxAge: Number,
  ageRelaxation: String,
  educationalQualifications: String,
  experienceRequired: String,

  // Job Specific
  specialization: String,
  medicalRegistration: String,
  department: String,
  licenseType: String,
  dutyHours: String,
  vehicleType: String,
  additionalSkills: String,

  // Selection Process
  selectionStages: {
    writtenExam: { type: Boolean, default: false },
    interview: { type: Boolean, default: false },
    skillTest: { type: Boolean, default: false },
    drivingTest: { type: Boolean, default: false },
    documentVerification: { type: Boolean, default: false },
    medicalTest: { type: Boolean, default: false },
  },
  selectionProcess: String,

  // Application Details
  applicationStartDate: Date,
  applicationEndDate: Date,
  applicationFee: String,
  applicationMode: { type: String, default: 'online' },
  applicationLink: String,
  applicationEmail: String,

  // Documents Required
  requiredDocuments: {
    educational: { type: Boolean, default: false },
    experience: { type: Boolean, default: false },
    drivingLicense: { type: Boolean, default: false },
    medicalRegistrationDoc: { type: Boolean, default: false },
    idProof: { type: Boolean, default: false },
    photo: { type: Boolean, default: false },
    signature: { type: Boolean, default: false },
  },

  // Job Description
  jobResponsibilities: String,
  importantNotes: String,

  // Contact
  contactEmail: String,
  contactDepartment: String,
  officialWebsite: String,
  jobLocation: String,

  // Status
  jobStatus: { type: String, default: 'draft' },
  featured: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
