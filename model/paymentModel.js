const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,  
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{timestamps:true});

module.exports = mongoose.model("Payment", paymentSchema);
