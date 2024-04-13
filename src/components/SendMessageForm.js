import React, { useState } from 'react';
import EmojiPicker from './EmojiPicker'; // Import the EmojiPicker component

function SendMessageForm({ sendMessage }) {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    };

    const handleEmojiSelect = (emoji) => {
        setMessage(prevMessage => prevMessage + emoji);
        setShowEmojiPicker(false); // Close emoji picker after selection
    };

    return (
        <form className="send-message-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
            ></textarea>
            {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />} {/* Render EmojiPicker if showEmojiPicker is true */}
            <button type="button" className="emoji-picker-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                😊
            </button>
            <button type="submit">Send</button>
        </form>
    );
}

export default SendMessageForm;
