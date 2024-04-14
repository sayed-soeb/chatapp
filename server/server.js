const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socket = require('socket.io');
const messageRoutes = require('./routes/message');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.DbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Import the Message model
const Message = require('./models/Message');

// Routes
app.use('/api/messages', messageRoutes);

// Create HTTP server instance
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize Socket.IO and attach it to the HTTP server
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for 'sendMessage' event from client
    socket.on('sendMessage', async (data) => {
        try {
            // Create a new message object
            const newMessage = new Message({
                username: data.username,
                message: data.message,
            });

            // Save the new message to the database
            await newMessage.save();

            // Emit the received message to all connected clients
            io.emit('newMessage', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('deleteMessage', async (deletedMessageId) => {
        try {
            // Delete the message from the database
            await Message.findByIdAndDelete(deletedMessageId);
            // Broadcast the message deletion event to all connected clients
            io.emit('messageDeleted', deletedMessageId);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    });

    socket.on('likeUpdated', (likeCount) => {
        // Broadcast the updated like count to all clients
        io.emit('likeUpdated', likeCount);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
