import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .utility import HandleCustomChatMethods

from django.contrib.auth import get_user_model

from .models import Message

User = get_user_model()


class ChatConsumer(WebsocketConsumer, HandleCustomChatMethods):
    def fetch_messages(self, data):
        messages = Message.last_10_messages()
        content = {
            'command': 'recent_messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_message(content)

    def new_message(self, data):
        author = data['from']
        auth_user = User.objects.filter(username=author)[0]
        message = Message.objects.create(
            author=auth_user,
            content=data['message']
        )
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self._send_chat_message(content)

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def _send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group -- echo back to all the socket connections
    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))

    # Echo back to the same client
    def send_message(self, message):
        self.send(text_data=json.dumps(message))
