const roomName = JSON.parse(document.getElementById('room_name').textContent)
const username = JSON.parse(document.getElementById('username').textContent)

const chatSocket = new ReconnectingWebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onopen = function (e) {
    console.log("Opening the Socket....")
    fetchMessage();
}

const fetchMessage = () => {
    chatSocket.send(JSON.stringify({
        'command': 'fetch_messages'
    }))
}

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    console.log(data)
    if (data['command'] === 'new_message') {
        createMessage(data['message'])
    } else if (data['command'] === 'recent_messages') {
        data['messages'].forEach((e) => {
            createMessage(e)
        })
    }
    $(".messages").animate({ scrollTop: $(document).height() }, "fast")
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function (e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    if (message) {
        chatSocket.send(JSON.stringify({
            'message': message,
            'command': 'new_message',
            'from': username
        }));
        messageInputDom.value = '';
    } else {
        return
    }
};

function createMessage(data) {
    const author = data['author'];
    const msgTagList = document.createElement('li');
    const imageTag = document.createElement('img');
    const pTag = document.createElement('p');
    pTag.textContent = data.content;
    imageTag.src = 'http://emilcarlsson.se/assets/mikeross.png';

    if (author === username) {
        msgTagList.className = 'sent';
    } else {
        msgTagList.className = 'replies';
    }

    msgTagList.appendChild(imageTag);
    msgTagList.appendChild(pTag);

    document.querySelector('#chat-log').appendChild(msgTagList);
}

console.log("Coming FROM chatROOM", username, roomName)

$("#profile-img").click(function () {
    $("#status-options").toggleClass("active");
});

$(".expand-button").click(function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function () {
    $("#profile-img").removeClass();
    $("#status-online").removeClass("active");
    $("#status-away").removeClass("active");
    $("#status-busy").removeClass("active");
    $("#status-offline").removeClass("active");
    $(this).addClass("active");

    if ($("#status-online").hasClass("active")) {
        $("#profile-img").addClass("online");
    } else if ($("#status-away").hasClass("active")) {
        $("#profile-img").addClass("away");
    } else if ($("#status-busy").hasClass("active")) {
        $("#profile-img").addClass("busy");
    } else if ($("#status-offline").hasClass("active")) {
        $("#profile-img").addClass("offline");
    } else {
        $("#profile-img").removeClass();
    };

    $("#status-options").removeClass("active");
});

// function newMessage() {
//     message = $(".message-input input").val();
//     if ($.trim(message) == '') {
//         return false;
//     }
//     $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
//     $('.message-input input').val(null);
//     $('.contact.active .preview').html('<span>You: </span>' + message);
//     $(".messages").animate({ scrollTop: $(document).height() }, "fast");
// };

// $('.submit').click(function () {
//     newMessage();
// });

// $(window).on('keydown', function (e) {
//     if (e.which == 13) {
//         newMessage();
//         return false;
//     }
// });