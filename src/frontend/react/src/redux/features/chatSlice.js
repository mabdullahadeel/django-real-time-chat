import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        allChats: null,
        chat: null,
        currentMessages: null,
        allMessages: null,
    },
    reducers: {
        setCurrentChat: (state, action) => {
            state.chat = action.payload;
            // setting the messages to the messages to the selected/active group
            if (state.allMessages) {
                state.currentMessages = state.allMessages[action.payload.slug]
            }
        },
        setAllMessages: (state, action) => {
            state.allMessages = action.payload;
        },
        setAllChats: (state, action) => {
            state.allChats = action.payload;
        },
        addNewMessage: (state, action) => {
            const { group_slug, message } = action.payload;
            if (state.allMessages) {
                state.allMessages[group_slug]?.push(message)
                // updating to show in the messages of currently active chat
                state.currentMessages?.push(message)
            }
        }
    },
});

export const { setCurrentChat, setAllMessages, setAllChats, addNewMessage } = chatSlice.actions;
export const selectCurrentChat = state => state.chat.chat;
export const selectCurrentMessages = state => state.chat.currentMessages;
export const selectAllChats = state => state.chat.allChats;
export const selectAllMessages = state => state.chat.allMessages;

export default chatSlice.reducer;