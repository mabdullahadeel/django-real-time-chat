
export default function getUserData() {
    let userData = {};

    const username = JSON.parse(document.getElementById('username').textContent);
    const slug = JSON.parse(document.getElementById('slug').textContent);
    const profile_pic = JSON.parse(document.getElementById('profile_picture').textContent).slice(1, -1);

    userData = {
        username: username,
        slug: slug,
        profile_pic: profile_pic
    }

    return userData
}