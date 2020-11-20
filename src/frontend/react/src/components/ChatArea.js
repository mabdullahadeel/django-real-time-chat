import React, { useState, useEffect } from 'react';
import '../Css/chat.css';

function ChatArea({ oldMessages, username, currentSocket }) {
    const [message, setMessage] = useState('');
    const [newMessages, setNewMessages] = useState([]);

    const sendMessage = () => {
        if (message) {
            currentSocket.send(JSON.stringify({
                'message': message,
                'command': 'new_message',
                'from': username
            }));
            setMessage('')
        } else {
            return
        }
    }

    currentSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data['command'] === 'new_message') {
            console.log(data);
            setNewMessages(newMessages => newMessages.push(data['message']))
        }
    }


    return (
        <>
            <div className="content">
                <div className="contact-profile">
                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                    <p>Harvey Specter</p>
                    <div className="social-media">
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                        <i className="fa fa-instagram" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="messages">
                    <ul id="chat-log">
                        <li className="sent">
                            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
                            <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!
                        </p>
                        </li>
                        <li className="replies">
                            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                            <p>When you're backed against the wall, break the god damn thing down.</p>
                        </li>
                        {oldMessages.map((message) => (
                            <li className={message.author === username ? "replies" : "sent"}>
                                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                                <p>{message.content}</p>
                            </li>
                        ))}
                        {newMessages && newMessages.map(() => (
                            <li className={message.author === username ? "replies" : "sent"}>
                                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                                <p>{message.content}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="message-input">
                    <div className="wrap">
                        <input
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value)
                            }}
                            id="chat-message-input" type="text" placeholder="Write your message..." />
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
