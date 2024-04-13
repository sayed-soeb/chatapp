import React, { useState } from 'react';

function NameEntryForm({ onNameSubmit }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onNameSubmit(username);
        }
    };

    return (
        <form className="name-entry-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Join Chat</button>
        </form>
    );
}

export default NameEntryForm;
