import React, { useState } from 'react';
import EmojiPicker from './EmojiPicker';

function SendMessageForm({ sendMessage }) {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage(''); // Clear message after sending
    };

    const handleEmojiSelect = (emoji) => {
        setMessage(prevMessage => prevMessage + emoji);
        setShowEmojiPicker(false); // Close emoji picker after selection
    };

    return (
        <>
        <div>
        <form className="send-message-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
            ></textarea>
            <div className="emoji-picker-container">
                {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
                <button type="button" className="emoji-picker-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    😊
                </button>
            </div>
            <button type="submit">Send</button>
        </form>
        </div>
        </>
    );
}

export default SendMessageForm;
