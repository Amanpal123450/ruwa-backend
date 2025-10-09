// MongoDB Schema for E-KYC Form
const ekycSchema = {
  // Application Reference
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Section 1: Personal Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  spouseName: {
    type: String,
    trim: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  education: {
    type: String,
    required: true,
    trim: true
  },
  portfolio: {
    type: String,
    trim: true
  },

  // Section 2: Address Details
  address: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  block: {
    type: String,
    required: true,
    trim: true
  },
  gramPanchayat: {
    type: String,
    trim: true
  },
  village: {
    type: String,
    trim: true
  },
  ward: {
    type: String,
    trim: true
  },

  // Section 3: Kendra Location Details
  kendraLocation: {
    type: String,
    required: true,
    trim: true
  },
  kendraMap: {
    type: String, // File path or URL
    required: true
  },
  kendraMapName: {
    type: String
  },
  
  // Boundary Details
  boundaryEast: {
    type: String,
    required: true,
    trim: true
  },
  boundaryWest: {
    type: String,
    required: true,
    trim: true
  },
  boundaryNorth: {
    type: String,
    required: true,
    trim: true
  },
  boundarySouth: {
    type: String,
    required: true,
    trim: true
  },

  // Area Measurements
  length: {
    type: Number,
    required: true,
    min: 0
  },
  width: {
    type: Number,
    required: true,
    min: 0
  },
  height: {
    type: Number,
    min: 0
  },

  // Section 4: Infrastructure & Environment
  radiationEffect: {
    type: String,
    required: true,
    enum: ['none', 'low', 'medium', 'high']
  },
  cellularTower: {
    type: String,
    required: true,
    enum: ['yes', 'no']
  },
  electricityHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  powerBackup: {
    type: String,
    required: true,
    trim: true
  },
  nearestMetro: {
    type: Number,
    required: true,
    min: 0
  },
  nearestRailway: {
    type: Number,
    required: true,
    min: 0
  },
  nearestAirport: {
    type: Number,
    min: 0
  },
  dumpYard: {
    type: String,
    required: true,
    trim: true
  },
  sewerage: {
    type: String,
    required: true,
    trim: true
  },
  waterResources: {
    type: String,
    required: true,
    trim: true
  },
  aqi: {
    type: Number,
    min: 0
  },

  // Transportation
  transportRoad: {
    type: Boolean,
    default: false
  },
  transportRailway: {
    type: Boolean,
    default: false
  },
  transportAirways: {
    type: Boolean,
    default: false
  },
  transportWaterways: {
    type: Boolean,
    default: false
  },
  roadCondition: {
    type: String,
    required: true,
    enum: ['fair', 'good', 'average']
  },
  roadType: {
    type: String,
    required: true,
    enum: ['kachhi', 'tar', 'concrete']
  },

  // Weather Conditions
  weatherHot: {
    type: Boolean,
    default: false
  },
  weatherRainy: {
    type: Boolean,
    default: false
  },
  weatherCold: {
    type: Boolean,
    default: false
  },
  weatherMild: {
    type: Boolean,
    default: false
  },

  // Section 5: Kendra Structure
  structureType: {
    type: String,
    required: true,
    enum: ['pakka', 'semi-pakka', 'kachha']
  },
  floors: {
    type: Number,
    required: true,
    min: 1
  },

  // Structure Photos
  frontProfile: {
    type: String, // File path or URL
    required: true
  },
  frontProfileName: {
    type: String
  },
  rightProfile: {
    type: String,
    required: true
  },
  rightProfileName: {
    type: String
  },
  leftProfile: {
    type: String,
    required: true
  },
  leftProfileName: {
    type: String
  },
  topProfile: {
    type: String,
    required: true
  },
  topProfileName: {
    type: String
  },
  surfaceProfile: {
    type: String,
    required: true
  },
  surfaceProfileName: {
    type: String
  },
  interiors: {
    type: String,
    required: true
  },
  interiorsName: {
    type: String
  },

  // 360° Videos
  // video360Interior: {
  //   type: String,
  //   required: true
  // },
  // video360InteriorName: {
  //   type: String
  // },
  // video360Exterior: {
  //   type: String,
  //   required: true
  // },
  // video360ExteriorName: {
  //   type: String
  // },

  // Section 6: Documents & Financial
  annualIncome: {
    type: String,
    required: true,
    trim: true
  },
  aadhaar: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{12}$/
  },
  pan: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  },

  // Required Documents
  bankPassbook: {
    type: String,
    required: true
  },
  bankPassbookName: {
    type: String
  },
  domicile: {
    type: String,
    required: true
  },
  domicileName: {
    type: String
  },
  nocProperty: {
    type: String,
    required: true
  },
  nocPropertyName: {
    type: String
  },
  propertyDeed: {
    type: String,
    required: true
  },
  propertyDeedName: {
    type: String
  },

  // Successor Information
  successorName: {
    type: String,
    required: true,
    trim: true
  },

  // Section 7: Contact & Family Details
  mobile1: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{10}$/
  },
  mobile2: {
    type: String,
    trim: true,
    match: /^\d{10}$/
  },
  emergencyContact: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{10}$/
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  dependents: {
    type: Number,
    required: true,
    min: 0
  },

  // Metadata
  status: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: String
  },
  remarks: {
    type: String,
    trim: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
};

// Mongoose Schema Example
const mongoose = require('mongoose');

const EKYCSchema = new mongoose.Schema(ekycSchema, {
  timestamps: true
});

// Indexes for better query performance
EKYCSchema.index({ applicationId: 1 });
EKYCSchema.index({ status: 1 });
EKYCSchema.index({ email: 1 });
EKYCSchema.index({ mobile1: 1 });
EKYCSchema.index({ aadhaar: 1 });
EKYCSchema.index({ pan: 1 });

// Pre-save middleware to update timestamps
EKYCSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('EKYC', EKYCSchema);