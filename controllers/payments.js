const instance = require("../config/razorpay");
const User = require("../models/userModel");
const Product = require("../models/productModel")
const crypto = require('crypto');
const mongoose = require("mongoose");
const Payment = require("../models/paymentModel")
const Order = require("../models/orderModel")



// working   properly
exports.capturePayment = async (req, res) => {
  try {
    const { products, amount } = req.body;

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide product IDs in an array" });
    }

    const userId = req.user.id;

    // Convert product IDs to ObjectId
    const productIds = products.map(productId => new mongoose.Types.ObjectId(productId));

    // Fetch user details
    const userDetails = await User.findById(userId);
    if (!userDetails || !userDetails.address) {
      return res.status(404).json({ success: false, message: "User or address not found" });
    }

    const shippingAddress = userDetails.address.addressLine || "No address provided";

    // Create Razorpay order
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const paymentResponse = await instance.orders.create(options);

    // Save order in DB
    const order = new Order({
      userId,
      totalAmount: options.amount,
      products: productIds,
      shippingAddress
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      order: paymentResponse
    });

  } catch (error) {
    console.error("Capture Payment Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// working properly
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Payment.create({
        razorpay_order_id,
        razorpay_signature,
        razorpay_payment_id,
        user: new mongoose.Types.ObjectId(userId),
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified and saved successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed (invalid signature)",
      });
    }
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying payment",
    });
  }
};
 
// working properly 
exports.fetchAllPayments = async (req, res) => {
  try {

    const allPayments = await Payment.find({}).populate("user");
    return res.status(200).json(
      {
        success: true,
        allPayments
      }
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error"
    })
  }
}
