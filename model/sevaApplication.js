const mongoose = require("mongoose");

const janSwabhimanApplySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    
      
    
  },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(v.replace(/\s/g, '')); // Aadhaar validation
      },
      message: props => `${props.value} is not a valid Aadhaar number!`
    }
  },
  annualFamilyIncome: {
    type: Number,
    required: true,
    min: 0,
    max: 10000000 // 1 crore max
  },
  residentialArea: {
    type: String,
    required: true,
    enum: ['Urban', 'Rural', 'Semi-Urban']
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ""
  },
  idProof: {
    type: String, // Cloudinary URL
    required: false
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN'],
    default: 'PENDING'
  },
  appliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Additional fields for tracking
  cardNumber: {
    type: String,
    unique: true,
    sparse: true // Only unique if not null
  },
  issuedDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 200
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
janSwabhimanApplySchema.index({ aadhaarNumber: 1 });
janSwabhimanApplySchema.index({ phoneNumber: 1 });
janSwabhimanApplySchema.index({ status: 1 });
janSwabhimanApplySchema.index({ appliedBy: 1 });
janSwabhimanApplySchema.index({ createdAt: -1 });

// Pre-save middleware to generate card number when approved
janSwabhimanApplySchema.pre('save', function(next) {
  if (this.status === 'APPROVED' && !this.cardNumber) {
    // Generate unique card number (JSS + timestamp + random)
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.cardNumber = `JSS${timestamp}${random}`;
    
    // Set issued date and expiry (valid for 3 years)
    this.issuedDate = new Date();
    this.expiryDate = new Date();
    this.expiryDate.setFullYear(this.expiryDate.getFullYear() + 3);
  }
  next();
});

// Virtual for formatted card number
janSwabhimanApplySchema.virtual('formattedCardNumber').get(function() {
  if (this.cardNumber) {
    return this.cardNumber.replace(/(.{3})(.{4})(.{4})(.{4})/, '$1-$2-$3-$4');
  }
  return null;
});

// Virtual for card status
janSwabhimanApplySchema.virtual('cardStatus').get(function() {
  if (this.status !== 'APPROVED') return 'INACTIVE';
  if (this.expiryDate && this.expiryDate < new Date()) return 'EXPIRED';
  return 'ACTIVE';
});

// Instance methods
janSwabhimanApplySchema.methods.isCardActive = function() {
  return this.status === 'APPROVED' && 
         this.expiryDate && 
         this.expiryDate > new Date();
};

janSwabhimanApplySchema.methods.getEligibilityInfo = function() {
  const eligibility = {
    welfareEligible: false,
    socialSecurityCoverage: false,
    freeAmbulance: false,
    priority: 'NORMAL'
  };

  if (this.status === 'APPROVED' && this.isCardActive()) {
    eligibility.welfareEligible = this.annualFamilyIncome <= 300000; // 3 lakhs
    eligibility.socialSecurityCoverage = true;
    eligibility.freeAmbulance = true;
    
    // Priority for rural and low income
    if (this.residentialArea === 'Rural' || this.annualFamilyIncome <= 150000) {
      eligibility.priority = 'HIGH';
    }
  }

  return eligibility;
};

// Static methods
janSwabhimanApplySchema.statics.findActiveCards = function() {
  return this.find({
    status: 'APPROVED',
    expiryDate: { $gt: new Date() }
  });
};

janSwabhimanApplySchema.statics.findByCardNumber = function(cardNumber) {
  return this.findOne({ cardNumber: cardNumber });
};

janSwabhimanApplySchema.statics.getStatsByArea = function() {
  return this.aggregate([
    {
      $group: {
        _id: {
          area: '$residentialArea',
          status: '$status'
        },
        count: { $sum: 1 },
        avgIncome: { $avg: '$annualFamilyIncome' }
      }
    }
  ]);
};

// Ensure virtual fields are serialized
janSwabhimanApplySchema.set('toJSON', { virtuals: true });
janSwabhimanApplySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("JanSwabhimanApply", janSwabhimanApplySchema);