const express = require('express');
const router = express.Router();
const Payment = require('../models/payments'); 

// Create new payment
router.post('/save/payments', async (req, res) => {
    try {
        const payment = new Payment({
            username: req.body.username,
            topic: req.body.topic,
            ticketCount: req.body.ticketCount,
            amount: req.body.amount
        });
        const savedPayment = await payment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all payments
router.get('/payments', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get payment by ID
router.get('/payments/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get payments by event name
router.get('/payments/event/:eventName', async (req, res) => {
    try {
        const payments = await Payment.find({ eventName: req.params.eventName });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update payment
router.put('/payments/:id', async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete payment
router.delete('/payments/:id', async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get monthly aggregated payments
router.get('/payments/stats/monthly', async (req, res) => {
    try {
        const monthlyStats = await Payment.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    totalTickets: { $sum: "$ticketCount" },
                    totalIncome: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1
                }
            }
        ]);
        res.json(monthlyStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get overall statistics
router.get('/payments/stats/overall', async (req, res) => {
    try {
        const overallStats = await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    totalTicketsSold: { $sum: "$ticketCount" },
                    totalIncome: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);
        res.json(overallStats[0] || {
            totalTicketsSold: 0,
            totalIncome: 0,
            totalTransactions: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;