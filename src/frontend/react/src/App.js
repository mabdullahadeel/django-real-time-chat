import React, { useEffect } from 'react';
// Components
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './Css/chat.css';

function App() {

    useEffect(() => {
        const roomName = JSON.parse(document.getElementById('room_name').textContent)
        const username = JSON.parse(document.getElementById('username').textContent)

        const chatSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/chat/'
            + roomName
            + '/'
        );

        chatSocket.onopen = function (e) {
            console.log("Opening the Socket....")
            console.log("WebSocket Opened Succeddfully...")
        }

        chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };


    }, [])

    return (
        <div id="frame">
            <Sidebar />
            <ChatArea />
        </div>

    )
}

export default App
