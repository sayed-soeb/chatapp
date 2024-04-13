// Message.js

import React, { useState } from 'react';
import axios from 'axios';

const Message = ({ message }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(message.likes);

    const toggleLike = async () => {
        try {
            if (!liked) {
                // Like the message
                await axios.post(`http://localhost:5000/api/messages/${message._id}/like`);
                setLikeCount(likeCount + 1);
            } else {
                // Unlike the message
                await axios.delete(`http://localhost:5000/api/messages/${message._id}/like`);
                setLikeCount(likeCount - 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const deleteMessage = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/messages/${message._id}`);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div className="message">
            <p><strong>{message.username}</strong>: {message.message}</p>
            <div className="message-actions">
                <button onClick={toggleLike} className={`like-btn ${liked ? 'liked' : ''}`}>
                    <span role="img" aria-label="heart">❤️</span> {likeCount}
                </button>
                <button onClick={deleteMessage} className="delete-btn">
                    <span role="img" aria-label="trash">🗑️</span>
                </button>
            </div>
        </div>
    );
};

export default Message;
