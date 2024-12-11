const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true
    },
    ticketType: {
        type: String,
        required: [true, 'Ticket type is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Ticket price is required'],
        min: [0, 'Price must be a positive number']
    },
    count: {
        type: Number,
        required: [true, 'Ticket count is required'],
        min: [0, 'Count must be a non-negative number']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ticketSchema.index({ eventName: 1, ticketType: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);