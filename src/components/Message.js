import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('https://chatapp-by-sayed.onrender.com');

const Message = ({ message, setMessages }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(message.likes);
    const [likes, setLikes] = useState(0);
    const [deleted, setDeleted] = useState(false);
    const messageRef = useRef(null);

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

    useEffect(() => {
        if (messageRef.current) {
            // Scroll to the bottom of the message container
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageRef]);

    const toggleLike = async () => {
        try {
            if (!liked) {
                const response = await axios.post(`https://chatapp-by-sayed.onrender.com/api/messages/${message._id}/like`);
                const updatedLikeCount = response.data.likes;
                setLikes(updatedLikeCount);
                socket.emit('likeUpdated', updatedLikeCount);

            } else {
                const response = await axios.delete(`https://chatapp-by-sayed.onrender.com/api/messages/${message._id}/like`);
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
            await axios.delete(`https://chatapp-by-sayed.onrender.com/api/messages/${message._id}`);
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
        <div ref={messageRef} className="message">
            <div className="message-info">
                <div className="user-circle" style={{ backgroundColor: getUserColor(message.username) }}>{message.username.charAt(0)}</div>
                <div className='detail-users'>
                    <p className="user-name">{message.username}</p>
                    <p className="message-time">{formatTime(message.createdAt)}</p>
                </div>
            </div>
            <div className='message-tab'>
                <p className="message-content">{message.message}</p>
                <div className="message-actions">
                    <button onClick={toggleLike} className={`like-btn ${liked ? 'liked' : ''}`}>
                        {liked ? <span role="img" aria-label="heart">❤️</span> : <span role="img" aria-label="heart">🤍</span>} {likeCount}
                    </button>
                    <button onClick={deleteMessage} className="delete-btn">
                        <span role="img" aria-label="trash">🗑️</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Function to generate random color for user circle
const getUserColor = (username) => {
    // Generate a hash code from the username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash code to a hexadecimal color
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
};
const formatTime = (createdAt) => {
    const messageTime = new Date(createdAt);
    const hours = messageTime.getHours();
    const minutes = messageTime.getMinutes();

    // Add leading zero to minutes if less than 10
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Format time as "hr:min"
    return `${hours}:${formattedMinutes}`;
};

export default Message;
