const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Details
  jobTitle: { type: String, required: true },
  advertisementNumber: { type: String },
  postingDate: { type: Date, default: Date.now },

  // Vacancy Details
  totalVacancies: { type: Number },
  jobCategory: { type: String },
  postName: { type: String },
  payScale: { type: String },
  numberOfPosts: { type: Number },

  // Age Criteria
  minAge: { type: Number },
  maxAge: { type: Number },
  ageRelaxation: { type: String },

  // Qualification & Experience
  educationalQualifications: { type: String },
  experienceRequired: { type: String },

  // Application Details
  applicationStartDate: { type: Date },
  applicationEndDate: { type: Date },
  applicationFee: { type: String },
  applicationMode: { type: String, enum: ['online', 'offline'], default: 'online' },
  applicationLink: { type: String },

  // Contact Information
  contactEmail: { type: String },
  contactDepartment: { type: String },
  officialWebsite: { type: String },

  // Job Description
  jobResponsibilities: { type: String },
  importantNotes: { type: String },

  // Status and Flags
  jobStatus: { 
    type: String, 
    enum: ['draft', 'active', 'closed'], 
    default: 'draft' 
  },
  featured: { type: Boolean, default: false },

  // Location
  jobLocation: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
