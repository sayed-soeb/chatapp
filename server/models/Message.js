const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Message', messageSchema);
