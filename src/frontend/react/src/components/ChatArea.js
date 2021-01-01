import React, { useRef } from 'react';
import { MEDIA_BASE_URL } from '../configurations/urls';
import '../Css/chat.css';

import { useSelector } from 'react-redux';
import { selectCurrentChat, selectCurrentMessages } from '../redux/features/chatSlice';
import { selectUser } from '../redux/features/userSlice';

function ChatArea({ currentSocket }) {
    const message = useRef('');
    const currentChat = useSelector(selectCurrentChat);
    const currentMessages = useSelector(selectCurrentMessages);
    const user = useSelector(selectUser);

    const sendMessage = () => {
        if (message.current) {
            currentSocket.send(JSON.stringify({
                'content': message.current,
                'command': 'new_message',
                'group_slug': currentChat.slug,
                'from': user.username
            }));
            message.current = '';
            document.getElementById("chat-message-input").value = "";
        } else {
            return null
        }
    }

    function enterEvent(event) {
        if (event.keyCode == 13) {
            sendMessage()
            return
        }
    }

    function addEnterEventListner() {
        console.log("Adding Listner");
        window.addEventListener("keyup", enterEvent)
    }

    function userLeftInput() {
        console.log('User Left the input');
        window.removeEventListener("keyup", enterEvent);
    }

    return (
        <>
            <div className="content">
                <div className="contact-profile">
                    <img src={
                        user?.profile_pic ?
                            `${MEDIA_BASE_URL}${user.profile_pic}`
                            :
                            `${MEDIA_BASE_URL}default_avatar.png`

                    } alt="default-profile-picture" />
                    {/* <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /> */}
                    <p>{currentChat?.group_name}</p>
                    <div className="social-media">
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                        <i className="fa fa-instagram" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="messages">
                    <ul id="chat-log">
                        {currentMessages?.map((message) => (
                            <li className={message.author === user.username ? "replies" : "sent"}>
                                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                                <p>{message.content}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="message-input">
                    <div className="wrap">
                        <input
                            onFocus={addEnterEventListner}
                            onBlur={userLeftInput}
                            onChange={(e) => {
                                message.current = e.target.value
                            }}
                            id="chat-message-input" type="textarea" placeholder="Write your message..." />
                        <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                        <button
                            onClick={sendMessage}
                            id="chat-message-submit" className="submit"><i className="fa fa-paper-plane"
                                aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ChatArea;
