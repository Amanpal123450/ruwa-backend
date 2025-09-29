const router = require('express').Router();
const walletController = require('../controllers/walletController');
const { authorizeRole,auth } = require("../middlewares/auth");

// Existing routes
router.post('/create',auth,authorizeRole("USER"), walletController.createWallet);
router.get('/balance',auth,authorizeRole("USER"), walletController.getBalance);
router.get('/transactions',auth,authorizeRole("USER"), walletController.getTransactions);
router.post('/transfer', walletController.transferMoney);

// New Razorpay routes
router.post('/create-order',auth,authorizeRole("USER"), walletController.createPaymentOrder);
router.post('/verify-payment',auth,authorizeRole("USER"), walletController.verifyPaymentAndCredit);

router.post('/credit',auth,authorizeRole("USER"), walletController.creditWallet);
router.post('/debit',auth,authorizeRole("USER"), walletController.debitWallet);

router.get('/payment-status/:paymentId', walletController.getPaymentStatus);
router.post('/refund/:paymentId', walletController.refundPayment);

module.exports = router;