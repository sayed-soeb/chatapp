import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Message = ({ message, setMessages }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(message.likes);
    const [likes , setLikes] = useState(0);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        socket.on('messageDeleted', (deletedMessageId) => {
            if (deletedMessageId === message._id) {
                setDeleted(true);
            }
        });

        return () => {
            socket.off('messageDeleted');
        };
    }, [message._id]);

    useEffect(() => {
        socket.on('likeUpdated', (updatedLikeCount) => {
            setLikeCount(updatedLikeCount);
        });

        return () => {
            socket.off('likeUpdated');
        };
    }, [likes]);

    const toggleLike = async () => {
        try {
            if (!liked) {
                const response = await axios.post(`http://localhost:5000/api/messages/${message._id}/like`);
                const updatedLikeCount = response.data.likes;
                setLikes(updatedLikeCount);
                socket.emit('likeUpdated', updatedLikeCount);
            
            } else {
                const response = await axios.delete(`http://localhost:5000/api/messages/${message._id}/like`);
                const updatedLikeCount = response.data.likes;
                setLikes(updatedLikeCount);
                socket.emit('likeUpdated', updatedLikeCount);
                
            }
            // Emit event to update like count for other users
            setLiked(!liked);
            console.log(likes);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const deleteMessage = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/messages/${message._id}`);
            // Emit message deletion event to the server
            socket.emit('deleteMessage', message._id);
            // Mark the message as deleted locally
            setDeleted(true);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    if (deleted) {
        return null; // Don't render the message if it has been deleted
    }

    return (
        <div className="message">
            <p><strong>{message.username}</strong>: {message.message}</p>
            <div className="message-actions">
                <button onClick={toggleLike} className={`like-btn ${liked ? 'liked' : ''}`}>
                    {liked ? <span role="img" aria-label="heart">❤️</span> : <span role="img" aria-label="heart">🤍</span>} {likeCount}
                </button>
                <button onClick={deleteMessage} className="delete-btn">
                    <span role="img" aria-label="trash">🗑️</span>
                </button>
            </div>
        </div>
    );
};

export default Message;
