const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/payments/create - Create payment
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Simulate payment creation
    const paymentId = `PAY-${uuidv4()}`;

    res.json({
      paymentId,
      amount,
      status: 'pending',
      message: 'Payment created successfully'
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/payments/verify - Verify payment
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID required' });
    }

    // Simulate payment verification (always success for demo)
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      res.json({
        verified: true,
        paymentId,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        verified: false,
        paymentId,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
