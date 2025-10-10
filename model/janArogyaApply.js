const mongoose = require("mongoose");

const janArogyaApplySchema = new mongoose.Schema({
  // Personal Details
  title: { type: String },
  name: { type: String, required: true },
  aadhaar: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ["M", "F", "O"] },
  married: { type: String, enum: ["Y", "N"] },

  // Educational Qualifications
  educationalQualifications: [
    {
      qualification: String,
      year: String,
      institution: String,
    },
  ],

  // Work / Occupation
  currentOccupation: { type: String },
  currentEmployer: { type: String },
  designation: { type: String },
  previousWorkExperience: [
    {
      period: String,
      organization: String,
      designation: String,
      responsibilities: String,
    },
  ],

  // Business Details
  businessDetails: [
    {
      companyName: String,
      businessType: String,
      nature: String,
      products: String,
      years: String,
      employees: String,
      turnover: String,
    },
  ],

  // Professional Background
  professionalBackground: [{ type: String }],
  professionalAssociations: { type: String },

  // Proposed Centre
  businessStructure: { type: String },
  existingEntity: { type: String },
  existingEntityName: { type: String },
  proposedCity: { type: String },
  proposedState: { type: String },
  setupTimeline: { type: String },
  sitePossession: { type: String },
  siteDetails: {
    agreementType: String,
    leaseFrom: String,
    leaseTo: String,
    area: String,
    locationType: String,
    address: String,
    
  },
  siteInMind: { type: String },
  planToRent: { type: String },
  withinMonths: { type: String },
  investmentRange: { type: String },
  effortsInitiatives: { type: String },
  reasonsForPartnership: { type: String },

  // File uploads as string paths
  idProof: { type: String },
  qualificationCertificate: { type: String },
  financialStatement: { type: String },

  // Payment
  payment: {
    paymentId: { type: String },
    screenshotUrl: { type: String },
    paid: { type: Boolean, default: false },
  },
  EKYC:{type:Boolean,default:false},
  // Status for admin
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"],
    default: "PENDING",
  },
  
  
remarks:{type:String},
  ekycStatus:{ type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"],
    default: "PENDING",},
     applicationId:{type:String,required:true},
      enrollmentNo:{type:String,required:true},
      submissionDate:{type:String,required:true},
  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("JanArogyaApply", janArogyaApplySchema);
