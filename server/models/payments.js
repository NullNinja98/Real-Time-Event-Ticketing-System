const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    ticketCount: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
