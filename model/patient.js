const mongoose = require("mongoose");


const visitSchema = new mongoose.Schema({
   name:String,
      phone:String,
      email:String,
      age:Number,
      aadhar:String,
      purpose:String,
      status:String,
      joinDate: String,
      applications: Number,
      profilePic:String,
      appliedBy:String
}, { timestamps: true });

module.exports = mongoose.model("VisitSchema", visitSchema);
