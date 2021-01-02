import React from 'react';
import '../Css/chat.css';

import { selectUser } from '../redux/features/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChat, selectCurrentChat, selectAllChats, selectAllMessages } from '../redux/features/chatSlice';
import { MEDIA_BASE_URL } from '../configurations/urls';

function Sidebar() {
    const user = useSelector(selectUser);
    const allChats = useSelector(selectAllChats);
    const chat = useSelector(selectCurrentChat);
    const allMessages = useSelector(selectAllMessages);
    const dispatch = useDispatch();

    return (
        <>
            <div id="sidepanel">
                <div id="profile">
                    <div className="wrap">
                        <img id="profile-img" src={
                            user?.profile_pic ?
                                `${MEDIA_BASE_URL}${user.profile_pic}`
                                : `${MEDIA_BASE_URL}default_avatar.png`
                        } className="online" alt="" />
                        <p>{user?.username}</p>
                        <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                        <div id="status-options">
                            <ul>
                                <li id="status-online" className="active"><span className="status-circle"></span>
                                    <p>Online</p>
                                </li>
                                <li id="status-away"><span className="status-circle"></span>
                                    <p>Away</p>
                                </li>
                                <li id="status-busy"><span className="status-circle"></span>
                                    <p>Busy</p>
                                </li>
                                <li id="status-offline"><span className="status-circle"></span>
                                    <p>Offline</p>
                                </li>
                            </ul>
                        </div>
                        <div id="expanded">
                            <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
                            <input name="twitter" type="text" value="mikeross" />
                            <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
                            <input name="twitter" type="text" value="ross81" />
                            <label htmlFor="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
                            <input name="twitter" type="text" value="mike.ross" />
                        </div>
                    </div>
                </div>
                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search contacts..." />
                </div>
                <div id="contacts">
                    <ul>
                        {allChats?.map((group) => (
                            <li className={`contact ${setCurrentChat && (chat?.slug === group.slug && 'active')} `}
                                onClick={() => dispatch(setCurrentChat(group))}
                            >
                                <div className="wrap">
                                    <span className="contact-status busy"></span>
                                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                                    <div className="meta">
                                        <p className="name">{group.group_name}</p>
                                        <p className="preview">
                                            {allMessages && (allMessages[group.slug][allMessages[group.slug].length - 1]?.content)}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id="bottom-bar">
                    <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add
                        contact</span></button>
                    <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
                </div>
            </div>
        </>
    )
}

export default Sidebar
