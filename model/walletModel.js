const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  amount: { type: Number, required: true },
  reason: { type: String, default: '' },
  method: { type: String, default: 'MANUAL' }, // RAZORPAY, WALLET, MANUAL
  paymentId: { type: String }, // Razorpay payment ID
  orderId: { type: String }, // Razorpay order ID
  transferId: { type: String }, // For wallet transfers
  status: { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'], default: 'SUCCESS' },
  timestamp: { type: Date, default: Date.now }
});

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [transactionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);