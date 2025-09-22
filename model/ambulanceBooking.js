const mongoose = require('mongoose');

const ambulanceBookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true,unique: true },
  email: { type: String, required: true },
  hospitalPreference: { type: String, required: true },
  appointmentDate: { type: Date, required: true, validator: function(v) {
        return v >= new Date().setHours(0, 0, 0, 0); // Cannot be in the past
      }, },
  preferredTime: { type: String, required: true },
   location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [500, 'Location cannot exceed 500 characters']
  },
    
  message: { type: String }, 
//   area: { type: String, required: true }, // fixed
  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // forUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN'],
    default: 'PENDING',
  },
}, { timestamps: true });

module.exports = mongoose.model('AmbulanceBooking', ambulanceBookingSchema);
