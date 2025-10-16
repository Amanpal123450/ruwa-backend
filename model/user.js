// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true, required: true },
  password: String,
  aadhar: { type: String, unique: true },
  userId:{type:Number,unique:true},
  email: { type: String, sparse: true }, // for admins/employees
  employeeId: { type: String, unique: true, sparse: true }, // for employees
    vendorId: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "EMPLOYEE","VENDOR"],
    default: "USER"
  },
    areaName: { type: String },
  gstNumber: { type: String },
  DOB:{type:Date},
  status:{type:String},
  purpose:{type:String},
 appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  forUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isVerified: { type: Boolean, default: true },
  verified:{type:Boolean,default:false},
  joinDate:{type:String},
  department:{type:String},
  address:{type:String},
  position:{type:String},
  // 🔹 Admin profile fields
  full_name: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  language: { type: String },
  time_zone: { type: String },
  nationality: { type: String },
  merchant_id: { type: String },
  profile_pic: { type: String }, // file URL

   currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  locationUpdatedAt: { type: Date },

  // 🔹 Online / Last seen tracking
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date },
  socketId: { type: String }, // ✅ Added for real-time disconnect tracking
});

module.exports = mongoose.model("User", userSchema);
