import React, { useEffect, useState, useRef } from 'react';
// Components
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './Css/chat.css';
import axios from 'axios';

function App() {
    const [oldMessages, setOldMessages] = useState([]);

    const socket = useRef({})
    const roomName = "you";
    const username = JSON.parse(document.getElementById('username').textContent)

    useEffect(() => {
        function getGroups() {
            axios.get("http://localhost:8000/api/groups/")
                .then(response => {
                    const groups = response.data;
                    groups.forEach((group) => console.log(group))
                })
                .catch(err => console.log(err))
        }
        getGroups()
    })

    useEffect(() => {
        socket.current = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/chat/group/'
            + roomName
            + '/'
        );
    }, [])

    useEffect(() => {
        socket.current.onopen = function (e) {
            console.log("WebSocket Opened Successfully...")
            // fetchMessage();
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
