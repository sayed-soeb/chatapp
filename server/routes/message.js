const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new message
router.post('/', async (req, res) => {
    try {
        const { username, message } = req.body;
        const newMessage = new Message({ username, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:id/like', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        message.likes++;
        await message.save();
        res.json(message);
    } catch (error) {
        console.error('Error liking message:', error);
        res.status(500).json({ error: 'Error liking message' });
    }
});

// Unlike a message
router.delete('/:id/like', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message.likes > 0) {
            message.likes--;
            await message.save();
        }
        res.json(message);
    } catch (error) {
        console.error('Error unliking message:', error);
        res.status(500).json({ error: 'Error unliking message' });
    }
});

// Delete a message
router.delete('/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Error deleting message' });
    }
});

module.exports = router;
