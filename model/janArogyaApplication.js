const mongoose = require("mongoose");

const janArogyaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhar: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  DOB:{type:Date},
  gender:{type:String},
  Qr:{type:String},
  card_no: {
  type: String,
  unique: true,
  required: true,
},
  email: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  profilePicUser:{ type: String, required: true },
  // email:{type:String},
  income_certificate: String,     // storing file as buffer
  caste_certificate: String,      // optional
  ration_id: String,               // ration card file
  reciept:{
    applicationId:{type:String,required:true},
    submissionDate:{type:String,required:true},
  },

  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // forUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("JanArogyaApplication", janArogyaSchema);
