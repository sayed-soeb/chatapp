import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Message from './Message';
import SendMessageForm from './SendMessageForm';
import NameEntryForm from './NameEntryForm'; // Import the NameEntryForm component

const socket = io('http://localhost:5000');

function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Fetch initial messages from server
        axios.get('/api/messages')
            .then(response => setMessages(response.data))
            .catch(error => console.error(error));

        // Listen for new messages from server
        socket.on('newMessage', newMessage => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('newMessage');
        };
    }, []);

    const handleNameSubmit = (name) => {
        setUsername(name);
    };

    const sendMessage = (message) => {
        if (username && message) {
            // Emit message to server
            socket.emit('sendMessage', { username, message });
        }
    };

    return (
        <div className="chat-room">
            {!username ? (
                <NameEntryForm onNameSubmit={handleNameSubmit} />
            ) : (
                <>
                    <div className="message-container">
                        {messages.map(msg => (
                            <Message key={msg._id} message={msg} />
                        ))}
                    </div>
                    <SendMessageForm sendMessage={sendMessage} />
                </>
            )}
        </div>
    );
}

export default ChatRoom;
