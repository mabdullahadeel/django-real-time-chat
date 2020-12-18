import React, { useState, useRef, useEffect } from 'react';
import '../Css/chat.css';

function ChatArea({ oldMessages, username, currentSocket }) {
    const message = useRef('')

    const sendMessage = () => {
        if (message.current) {
            currentSocket.send(JSON.stringify({
                'message': message.current,
                'command': 'new_message',
                'from': username
            }));
            message.current = '';
            document.getElementById("chat-message-input").value = "";
        } else {
            return
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

    currentSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data['command'] === 'new_message') {
            console.log(data);

            const author = data.message.author;
            const msgTagList = document.createElement('li');
            const imageTag = document.createElement('img');
            const pTag = document.createElement('p');
            pTag.textContent = data.message.content;
            imageTag.src = 'http://emilcarlsson.se/assets/mikeross.png';

            console.log(author, username)

            if (author === username) {
                msgTagList.className = 'replies';
            } else {
                msgTagList.className = 'sent';
            }

            msgTagList.appendChild(imageTag);
            msgTagList.appendChild(pTag);

            document.querySelector('#chat-log').appendChild(msgTagList);

            $(".messages").animate({ scrollTop: $(document).height() }, "fast");
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
