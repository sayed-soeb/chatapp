import React from 'react';

function EmojiPicker({ onSelect }) {
    const emojis = ['😊', '😂', '😍', '😎', '🥳', '🎉', '❤️', '👍', '👏', '🙌', '🤗', '😡', '😭', '😄', '😆'];

    return (
        <div className="emoji-picker">
            {emojis.map((emoji, index) => (
                <span key={index} onClick={() => onSelect(emoji)}>{emoji}</span>
            ))}
        </div>
    );
}

export default EmojiPicker;
