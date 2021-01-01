import React, { useEffect, useState } from 'react';
// Components
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

import './Css/chat.css';
import useSocket from './hooks/useSocket';

function App() {
    const socket = useSocket();

    return (
        <div id="frame">
            <Sidebar />
            <ChatArea currentSocket={socket} />
        </div>

    )
}

export default App;
