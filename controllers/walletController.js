const Wallet = require("../model/walletModel");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const razorpay = require("../config/razorpay");


// Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// 1. Create Wallet
exports.createWallet = async (req, res) => {
  try {
     const userId = req.user._id;
    // const { userId } = req.params;
    const wallet = new Wallet({ userId, balance: 0 });
    await wallet.save();
    res.json({ message: "Wallet created", wallet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Create Razorpay Order for Adding Money
exports.createPaymentOrder = async (req, res) => {
  try {
    // const { userId } = req.params;
     const userId = req.user._id;
    const { amount } = req.body; // amount in INR

    // Check if wallet exists
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create Razorpay order
   const options = {
  amount: amount * 100, // Razorpay expects amount in paisa
  currency: 'INR',
  receipt: `wallet_${userId.toString().substring(0,6)}_${Date.now().toString().slice(-6)}`,
  notes: {
    userId: userId.toString(),
    purpose: 'wallet_credit'
  }
};


    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(400).json({ error: error.message });
  }
};

// 3. Verify Payment and Credit Wallet
exports.verifyPaymentAndCredit = async (req, res) => {
  try {
    // const { userId } = req.params;
     const userId = req.user._id;
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      amount 
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Find wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    // Credit amount to wallet
    const creditAmount = amount / 100; // Convert from paisa to rupees
    wallet.balance += creditAmount;
    wallet.transactions.push({ 
      type: "CREDIT", 
      amount: creditAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      method: "RAZORPAY",
      status: "SUCCESS",
      timestamp: new Date()
    });

    await wallet.save();

    res.json({ 
      success: true,
      message: "Payment verified and amount credited", 
      balance: wallet.balance,
      transactionId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(400).json({ error: error.message });
  }
};

// 4. Add Money (Credit) - Direct method (for admin/testing)
exports.creditWallet = async (req, res) => {
  try {
    // const { userId } = req.params;
     const userId = req.user._id;
    const { amount, method = "MANUAL" } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    if (amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    wallet.balance += amount;
    wallet.transactions.push({ 
      type: "CREDIT", 
      amount,
      method,
      status: "SUCCESS",
      timestamp: new Date()
    });
    await wallet.save();

    res.json({ message: "Amount credited", balance: wallet.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 5. Deduct Money (Debit)
exports.debitWallet = async (req, res) => {
  try {
    // const { userId } = req.params;
     const userId = req.user._id;
    const { amount, reason = "Purchase" } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    if (amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    wallet.balance -= amount;
    wallet.transactions.push({ 
      type: "DEBIT", 
      amount,
      reason,
      method: "WALLET",
      status: "SUCCESS",
      timestamp: new Date()
    });
    await wallet.save();

    res.json({ message: "Amount debited", balance: wallet.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 6. Get Balance
exports.getBalance = async (req, res) => {
  try {
    // const { userId } = req.params;
     const userId = req.user._id;
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    res.json({ 
      success: true,
      balance: wallet.balance,
      userId: wallet.userId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 7. Transaction History
exports.getTransactions = async (req, res) => {
  try {
    // const { userId } = req.params;
      const userId = req.user._id;
    const { page = 1, limit = 10, type } = req.query;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    let transactions = wallet.transactions;

    // Filter by transaction type if specified
    if (type && ['CREDIT', 'DEBIT'].includes(type.toUpperCase())) {
      transactions = transactions.filter(t => t.type === type.toUpperCase());
    }

    // Sort by timestamp (newest first)
    transactions.sort((a, b) => new Date(b.timestamp || b._id.getTimestamp()) - new Date(a.timestamp || a._id.getTimestamp()));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    res.json({ 
      success: true,
      transactions: paginatedTransactions,
      totalTransactions: transactions.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(transactions.length / limit)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 8. Transfer Money
exports.transferMoney = async (req, res) => {
  try {
    const { fromUserId, toUserId, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: "Cannot transfer to same wallet" });
    }

    const fromWallet = await Wallet.findOne({ userId: fromUserId });
    const toWallet = await Wallet.findOne({ userId: toUserId });

    if (!fromWallet || !toWallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    if (fromWallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Generate transfer ID
    const transferId = `TXN_${Date.now()}`;

    // Debit from sender
    fromWallet.balance -= amount;
    fromWallet.transactions.push({ 
      type: "DEBIT", 
      amount,
      reason: `Transfer to ${toUserId}`,
      method: "WALLET_TRANSFER",
      transferId,
      status: "SUCCESS",
      timestamp: new Date()
    });

    // Credit to receiver
    toWallet.balance += amount;
    toWallet.transactions.push({ 
      type: "CREDIT", 
      amount,
      reason: `Transfer from ${fromUserId}`,
      method: "WALLET_TRANSFER",
      transferId,
      status: "SUCCESS",
      timestamp: new Date()
    });

    await fromWallet.save();
    await toWallet.save();

    res.json({ 
      success: true,
      message: "Transfer successful",
      transferId,
      senderBalance: fromWallet.balance,
      receiverBalance: toWallet.balance
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 9. Get Payment Status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount,
      method: payment.method,
      createdAt: payment.created_at
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(400).json({ error: error.message });
  }
};

// 10. Refund Payment
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason = "Refund requested" } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paisa
      notes: {
        reason: reason
      }
    });

    res.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount / 100,
      message: "Refund initiated successfully"
    });
  } catch (error) {
    console.error('Refund failed:', error);
    res.status(400).json({ error: error.message });
  }
};