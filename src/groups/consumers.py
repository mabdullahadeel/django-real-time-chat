import json
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from asgiref.sync import async_to_sync
import threading
from django.contrib.auth import get_user_model

from .models import Group, GroupMessage
from profiles.models import Profile
from .utils import HandleCustomGroupChatMethods


class GroupChatConsumer(WebsocketConsumer, HandleCustomGroupChatMethods):
    # Connecting to websockets
    def connect(self):
        # user Authentication
        user = self.scope['user']
        if user.is_authenticated:
            # getting all the groups of the user
            user_groups = Group.objects.get_groups_of_user(user=user)
            for grp in user_groups:
                group_name = grp.group_name
                group_layer_group_name = "group-" + grp.slug
                # Join room group
                async_to_sync(self.channel_layer.group_add)(
                    group_layer_group_name,
                    self.channel_name
                )

            self.accept()

    # Websocket Disconnection
    def disconnect(self, close_code):
        # Leave room group
        user = self.scope["user"]
        user_groups = Group.objects.get_groups_of_user(user=user)
        for grp in user_groups:
            group_name = grp.group_name
            group_layer_group_name = "group-" + grp.slug
            # Join room group
            async_to_sync(self.channel_layer.group_discard)(
                group_layer_group_name,
                self.channel_name
            )

    # Receiving messages through websocket
    def fetch_messages(self, data):
        if 'group_slug' in data:
            messages = GroupMessage.objects.fetch_last_10_messages(
                data['group_slug'])
            content = {
                'command': "fetch_messages",
                'messages': self.messages_to_json(messages=messages)
            }
            self.send_messages(content=content)
        else:
            user = self.scope['user']
            user_groups = Group.objects.get_groups_of_user(user=user)
            if user_groups.exists():
                content = {
                    'command': "all_user_group_messages",
                    'payload': self.user_groups_response(user_groups)
                }
                # Echo back to the same client
                self.send_messages(content=content)

    def send_messages(self, content):
        self.send(text_data=json.dumps(content))

    def new_message(self, data):
        author = data['from']
        # user authentication for the message
        if self.scope["user"].username == author:
            sender_profile = Profile.objects.filter(user__username=author)[0]
            group_slug = data["group_slug"]
            # Getting the group
            group = Group.objects.get(slug=group_slug)

            # Creating the new message in DB
            message = GroupMessage.objects.create(
                group_relation=group,
                author=sender_profile,
                content=data["content"]
            )

            content = {
                'command': 'new_message',
                'group_slug': group_slug,
                'message': self.message_to_json(message)
            }
            return self._send_chat_message(content)

    def _send_chat_message(self, message):
        # Broadcasting the message to the same group
        group_layer_group_name = "group-" + message["group_slug"]
        async_to_sync(self.channel_layer.group_send)(
            group_layer_group_name,
            {
                'type': 'chat.message',
                'message': message
            }
        )

    # Receive message from room group -- echo back to all the socket connections
    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)
