import { GET_USER_GROUPS_URL } from '../configurations/urls';
import axios from 'axios';

export default async function getUserChats() {
    let userChats = {};

    await axios.get(GET_USER_GROUPS_URL)
        .then(response => {
            userChats = response.data
        })
        .catch(err => console.log(err));

    return userChats
}