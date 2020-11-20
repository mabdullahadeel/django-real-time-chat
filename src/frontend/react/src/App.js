import React, { useEffect, useState, useRef } from 'react';
// Components
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './Css/chat.css';

function App() {
    const [oldMessages, setOldMessages] = useState([]);

    const socket = useRef({})
    const roomName = JSON.parse(document.getElementById('room_name').textContent)
    const username = JSON.parse(document.getElementById('username').textContent)

    useEffect(() => {

        socket.current = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/chat/'
            + roomName
            + '/'
        );
    }, [])

    useEffect(() => {
        socket.current.onopen = function (e) {
            console.log("WebSocket Opened Succeddfully...")
            fetchMessage();
        }

        socket.current.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };

        function fetchMessage() {
            socket.current.send(JSON.stringify({
                'command': 'fetch_messages'
            }))
        }

        socket.current.onmessage = function (e) {
            console.log('Received Messages');
            const data = JSON.parse(e.data);
            console.log(data)
            if (data['command'] === 'recent_messages') {
                setOldMessages(data['messages'])
            }
        }

    }, [socket])


    return (
        <div id="frame">
            <Sidebar />
            <ChatArea oldMessages={oldMessages.reverse()}
                username={username}
                currentSocket={socket.current}
            />
        </div>

    )
}

export default App
