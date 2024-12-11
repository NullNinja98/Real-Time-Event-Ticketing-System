const express = require('express');
const router = express.Router();
const Ticket = require('../models/tickets')


router.post('/ticket/save', async (req, res) => {
    try {
        const newTicket = new Ticket({
            topic: req.body.topic,
            ticketType: req.body.ticketType,
            price: req.body.price,
            count: req.body.count
        });

        const savedTicket = await newTicket.save();

        return res.status(201).json({
            success: true,
            message: "Ticket saved successfully",
            ticket: savedTicket
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A ticket for this event type already exists"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Error saving ticket",
            error: err.message
        });
    }
});

// Get all tickets
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find();

        if (tickets.length === 0) {
            return res.status(404).json({
                success: false,
                count: tickets.length,
                tickets: tickets
            });
        }

        return res.status(200).json({
            success: true,
            count: tickets.length,
            tickets: tickets
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

router.get('/tickets/event/:topic', async (req, res) => {
    try {
        const tickets = await Ticket.find({ topic: req.params.topic });

        return res.status(200).json({
            success: true,
            topic: req.params.topic,
            count: tickets.length,
            tickets: tickets,
            message: tickets.length === 0 ? `No tickets found for topic: ${req.params.topic}` : "Tickets retrieved successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
});


// Get unique event names
router.get('/events', async (req, res) => {
    try {
        const events = await Ticket.distinct('eventName');

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No events found"
            });
        }

        return res.status(200).json({
            success: true,
            count: events.length,
            events: events
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// Update a ticket
router.put('/ticket/update/:id', async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!updatedTicket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            ticket: updatedTicket
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

// Delete a ticket
router.delete('/ticket/delete/:id', async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

        if (!deletedTicket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket deleted successfully",
            ticket: deletedTicket
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;