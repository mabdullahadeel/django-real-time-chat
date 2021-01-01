import { useEffect, useRef } from 'react';
import { WEB_SOCKET_URL } from '../configurations/urls';

// redux
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/features/userSlice';
import { setAllMessages, setAllChats, addNewMessage } from '../redux/features/chatSlice';
import getUserData from '../utils/getUserData';
import getUserChats from '../utils/getUserChats';


export default function useSocket() {
    const userData = getUserData();
    const socket = useRef({});
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData() {
            const userChats = await getUserChats();
            dispatch(setAllChats(userChats))
        };
        fetchData();
    }, []);


    socket.current = new WebSocket(WEB_SOCKET_URL);

    socket.current.onopen = function (e) {
        dispatch(setUserData(userData));

        console.log("WebSocket Opened Successfully...");
        setTimeout(() => {
            fetchMessage();
        }, 2000)
    }

    socket.current.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };

    function fetchMessage() {
        socket.current.send(JSON.stringify({
            'command': 'fetch_messages',
        }))
    };

    socket.current.onmessage = function (e) {
        console.log('Received Messages');
        const data = JSON.parse(e.data);
        console.log(data);
        switch (data['command']) {
            case ("fetch_messages"):
                console.log(data);
            case ("all_user_group_messages"):
                dispatch(setAllMessages(data.payload))
            case ("new_message"):
                dispatch(addNewMessage(data))
        }
    }

    return socket.current

}