const express = require('express');
const router = express.Router();
const Events = require('../models/events');
const events = require('../models/events');

// Post event
router.post('/event/save', async (req, res) => {
    const newEvent = new Events(req.body);

    try {
        await newEvent.save();
        return res.status(200).json({
            success: "Event saved successfully"
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
});

router.get('/events', async (req, res) => {
    try {
        const events = await Events.find(); 
        
        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No events found",
            });
        }

        return res.status(200).json({
            success: true,
            existingEvents: events,
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
});


// Edit event
router.put('/event/update/:id', async (req, res) => {
    try {
        const updatedEvent = await Events.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } 
        );

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        return res.status(200).json({
            success: "Updated Successfully",
            updatedEvent: updatedEvent
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});


// Delete event
router.delete('/event/delete/:id', async (req, res) => {
    try {
        const deletedEvent = await Events.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ 
                message: "Event not found" 
            });
        }

        return res.json({
            message: "Delete successful",
            deletedEvent: deletedEvent
        });
    } catch (err) {
        return res.status(400).json({
            message: "Delete unsuccessful",
            error: err.message
        });
    }
});

 // Get total events route (no token required)
router.get('/events/total', async (req, res) => {
    try {
        const eventCount = await Events.countDocuments(); 
        res.json({ totalEvents: eventCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
