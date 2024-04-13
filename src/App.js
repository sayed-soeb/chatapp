import React from 'react';
import ChatRoom from './components/ChatRoom';
import './styles/styles.css'; 

function App() {
    return (
        <div className="App">
            <header>
                <h1>Chat App</h1>
            </header>
            <main>
                <ChatRoom />
            </main>
        </div>
    );
}

export default App;
